/* ================================================================
           ① HARDCODED DATA
           ─────────────────────────────────────────────────────────────────
           This is your single source of truth while you don't have an API.
           Shape is identical to what your API should return later.
           ================================================================ */
const BLOG_DATA = {
  /* ── Tag colour palette ─────────────────────────────────────── */
  tagColors: {
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
  },

  /* ── Posts ──────────────────────────────────────────────────── */
  posts: [
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
      id: "react-reconciler",
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
      id: "worker-threads",
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
      id: "css-containment",
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
      id: "message-queues",
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
  ],
};

/* ================================================================
           ② API LAYER
           ─────────────────────────────────────────────────────────────────
           To connect a real API later, replace ONLY the body of this
           function. The rest of the app never changes.
        
           Your endpoint should return the same JSON shape as BLOG_DATA:
           {
             tagColors: { "Tag": { bg, text, border } },
             posts: [
               {
                 id, featured, title, excerpt,
                 tags: ["Tag"],
                 date: "YYYY-MM-DD",
                 readTime: <number>,
                 level: "Beginner"|"Intermediate"|"Advanced",
                 href: "/blog/slug",
                 art: { type, bgFrom, bgTo, color, ...extra }
               }
             ]
           }
        
           Example swap:
             const res  = await fetch('https://your-api.com/api/posts');
             const data = await res.json();
             return data;
           ================================================================ */
async function loadPosts() {
  await new Promise((r) => setTimeout(r, 500)); // simulate network latency
  return BLOG_DATA;
}

/* ================================================================
           ③ SVG THUMBNAIL GENERATORS
           Each function receives the post's `art` object and returns an
           SVG string. Add new types here without touching anything else.
           ================================================================ */
const ArtRenderers = {
  orbit({ bgFrom, bgTo, accentColor, nodes, nodeColors }) {
    const c = "#7c6ef7";
    const dots = (nodes || [])
      .map((icon, i) => {
        const a = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
        const x = 260 + 100 * Math.cos(a);
        const y = 150 + 100 * Math.sin(a);
        const nc = nodeColors[i] || accentColor;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="20" fill="${nc}22" stroke="${nc}88" stroke-width="1"/>
              <text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle" font-size="14" fill="${nc}">${icon}</text>`;
      })
      .join("");
    return `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="og${Math.random().toString(36).slice(2, 6)}" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="${bgFrom}"/><stop offset="100%" stop-color="${bgTo}"/>
      </radialGradient></defs>
      <rect width="520" height="300" fill="url(#og${Math.random().toString(36).slice(2, 6)})"/>
      <circle cx="260" cy="150" r="100" fill="none" stroke="${c}33" stroke-width="1" stroke-dasharray="6 4"/>
      <circle cx="260" cy="150" r="65"  fill="none" stroke="${c}1a" stroke-width="1"/>
      ${dots}
      <circle cx="260" cy="150" r="30" fill="${c}26" stroke="${c}66" stroke-width="1.5"/>
      <text x="260" y="146" text-anchor="middle" font-size="9" fill="${accentColor}" font-family="Syne,sans-serif" font-weight="700">Event</text>
      <text x="260" y="158" text-anchor="middle" font-size="9" fill="${accentColor}" font-family="Syne,sans-serif" font-weight="700">Loop</text>
    </svg>`;
  },

  boxes({ color, title, labels }) {
    const cols = ["#60a5fa", "#a594ff", "#2dd4bf"];
    const bw = 65,
      gap = 8,
      startX = 50;
    const rects = (labels || [])
      .map((l, i) => {
        const x = startX + i * (bw + gap);
        return `<rect x="${x}" y="82" width="${bw}" height="28" rx="5" fill="${cols[i % 3]}1f" stroke="${cols[i % 3]}55" stroke-width="1"/>
              <text x="${x + bw / 2}" y="100" text-anchor="middle" font-size="9" fill="${cols[i % 3]}" font-family="DM Mono,monospace">${l}</text>`;
      })
      .join("");
    return `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="30" width="240" height="100" rx="8" fill="${color}0f" stroke="${color}33" stroke-width="1"/>
      <text x="150" y="68" text-anchor="middle" font-size="11" fill="${color}80" font-family="DM Mono,monospace">${title}</text>
      ${rects}
    </svg>`;
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
      gap = 12;
    const n = (labels || []).length;
    const totalW = n * bw + (n - 1) * gap;
    const startX = (300 - totalW) / 2;
    const bars = (labels || [])
      .map((l, i) => {
        const h = (heights || [])[i] || 60;
        const x = startX + i * (bw + gap);
        const y = 140 - h;
        const a = i === 1 ? ".15" : ".1";
        const sa = i === 1 ? ".4" : ".3";
        const sw = i === 1 ? "1.5" : "1";
        return `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="6" fill="${color}${a}" stroke="${color}${sa}" stroke-width="${sw}"/>
              <text x="${x + bw / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-size="8" fill="${color}" font-family="DM Mono,monospace">${l}</text>`;
      })
      .join("");
    return `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">${bars}</svg>`;
  },

  pipeline({ color, labels }) {
    const n = (labels || []).length;
    const bw = n <= 3 ? 70 : 52,
      bh = 34,
      gap = n <= 3 ? 24 : 14;
    const totalW = n * bw + (n - 1) * gap;
    const startX = (300 - totalW) / 2;
    const y = 63;
    const mid = Math.floor(n / 2);
    const boxes = (labels || [])
      .map((l, i) => {
        const x = startX + i * (bw + gap);
        const a = i === mid ? ".14" : ".08";
        const sa = i === mid ? ".4" : ".25";
        const sw = i === mid ? "1.5" : "1";
        return `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5" fill="${color}${a}" stroke="${color}${sa}" stroke-width="${sw}"/>
              <text x="${x + bw / 2}" y="${y + bh / 2 + 4}" text-anchor="middle" font-size="8" fill="${color}" font-family="DM Mono,monospace">${l}</text>`;
      })
      .join("");
    const lines = (labels || [])
      .slice(0, -1)
      .map((_, i) => {
        const x1 = startX + i * (bw + gap) + bw;
        const x2 = x1 + gap;
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

function renderArt(art) {
  const fn = ArtRenderers[art.type];
  if (!fn)
    return `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="160" fill="#18181f"/></svg>`;
  return fn(art);
}

/* ================================================================
           ④ HTML BUILDERS  — pure functions, data in → HTML string out
           ================================================================ */
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

function buildTagPills(tags, tagColors) {
  return tags
    .map((t) => {
      const c = tagColors[t] || {
        bg: "rgba(255,255,255,.06)",
        text: "#9090a8",
        border: "rgba(255,255,255,.12)",
      };
      return `<span class="ctag" style="background:${c.bg};color:${c.text};border-color:${c.border}">${t}</span>`;
    })
    .join("");
}

function buildFeaturedCard(post, tagColors) {
  const artBg = post.art.bgFrom
    ? `background:linear-gradient(135deg,${post.art.bgFrom},${post.art.bgTo})`
    : "background:var(--bg3)";
  return `
    <a href="${post.href}" class="featured reveal">
      <div class="featured-img" style="${artBg}">
        ${renderArt(post.art)}
        <div class="featured-badge">⭐ Featured</div>
      </div>
      <div class="featured-body">
        <div>
          <div class="featured-cat" style="color:var(--accent2)">${post.tags.join(" · ")}</div>
          <div class="featured-title">${post.title}</div>
          <p class="featured-excerpt">${post.excerpt}</p>
        </div>
        <div class="featured-footer">
          <div class="post-meta">
            <span>${fmtDate(post.date)}</span>
            <span class="sep"></span>
            <span>${post.readTime} min read</span>
            <span class="sep"></span>
            <span>${post.level}</span>
          </div>
          <span class="read-link">Read article →</span>
        </div>
      </div>
    </a>`;
}

const DELAY_CLASSES = [
  "",
  "reveal-d1",
  "reveal-d2",
  "reveal-d3",
  "reveal-d4",
  "reveal-d5",
  "reveal-d6",
];

function buildCard(post, tagColors, delayIdx) {
  const delay = DELAY_CLASSES[delayIdx % DELAY_CLASSES.length] || "";
  const artBg = post.art.bgFrom
    ? `background:linear-gradient(135deg,${post.art.bgFrom},${post.art.bgTo})`
    : "background:var(--bg3)";
  return `
    <a class="card reveal ${delay}"
       href="${post.href}"
       data-id="${post.id}"
       data-tags="${post.tags.join(",")}"
       data-date="${post.date}"
       data-read="${post.readTime}">
      <div class="card-art" style="${artBg}">${renderArt(post.art)}</div>
      <div class="card-body">
        <div class="card-tags">${buildTagPills(post.tags, tagColors)}</div>
        <div class="card-title">${post.title}</div>
        <p class="card-excerpt">${post.excerpt}</p>
        <div class="card-footer">
          <span>⏱ ${post.readTime} min read</span>
          <span class="arrow-icon">↗</span>
        </div>
      </div>
    </a>`;
}

/* ================================================================
           ⑤ APP STATE + FILTERING
           ================================================================ */
let ALL_POSTS = [];
let TAG_COLORS = {};
let activeTag = "all";
let searchQuery = "";
let sortOrder = "newest";

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("v");
    });
  },
  { threshold: 0.08 },
);

function observeNew() {
  document
    .querySelectorAll(".reveal:not(.v)")
    .forEach((el) => revealObserver.observe(el));
}

function getFilteredSorted() {
  const q = searchQuery.toLowerCase();
  return ALL_POSTS.filter((p) => !p.featured)
    .filter((p) => {
      const tagMatch = activeTag === "all" || p.tags.includes(activeTag);
      const textMatch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return tagMatch && textMatch;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.date) - new Date(a.date);
      if (sortOrder === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortOrder === "read") return a.readTime - b.readTime;
      return 0;
    });
}

function renderCards() {
  const posts = getFilteredSorted();
  const grid = document.getElementById("cardsGrid");
  const noRes = document.getElementById("noResults");
  const counter = document.getElementById("postCount");

  grid.innerHTML = posts.map((p, i) => buildCard(p, TAG_COLORS, i)).join("");
  noRes.style.display = posts.length === 0 ? "block" : "none";
  counter.textContent = `${posts.length} post${posts.length !== 1 ? "s" : ""}`;

  // Toggle featured card visibility based on active filters
  const featured = ALL_POSTS.find((p) => p.featured);
  if (featured) {
    const q = searchQuery.toLowerCase();
    const tagOk = activeTag === "all" || featured.tags.includes(activeTag);
    const textOk =
      !q ||
      featured.title.toLowerCase().includes(q) ||
      featured.excerpt.toLowerCase().includes(q) ||
      featured.tags.some((t) => t.toLowerCase().includes(q));
    document.getElementById("featuredWrap").style.display =
      tagOk && textOk ? "" : "none";
  }

  observeNew();
}

function buildFilterButtons(posts) {
  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  const container = document.getElementById("filterTagsEl");
  container.innerHTML =
    `<div class="filter-tag on" data-tag="all">All</div>` +
    tags
      .map((t) => `<div class="filter-tag" data-tag="${t}">${t}</div>`)
      .join("");

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-tag");
    if (!btn) return;
    container
      .querySelectorAll(".filter-tag")
      .forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    activeTag = btn.dataset.tag;
    renderCards();
  });
}

function updateStats(posts) {
  const tags = [...new Set(posts.flatMap((p) => p.tags))];
  const avgRead = Math.round(
    posts.reduce((s, p) => s + p.readTime, 0) / posts.length,
  );
  document.getElementById("statPosts").innerHTML =
    `${posts.length}<span>+</span>`;
  document.getElementById("statCats").textContent = tags.length;
  document.getElementById("statRead").innerHTML = `${avgRead}<span>m</span>`;
}

/* ================================================================
           ⑥ BOOT
           ================================================================ */
async function init() {
  try {
    const data = await loadPosts();

    ALL_POSTS = data.posts;
    TAG_COLORS = data.tagColors;

    // Stats
    updateStats(ALL_POSTS);

    // Featured
    const featured = ALL_POSTS.find((p) => p.featured);
    if (featured) {
      document.getElementById("featuredCard").innerHTML = buildFeaturedCard(
        featured,
        TAG_COLORS,
      );
      document.getElementById("featuredWrap").style.display = "";
    }

    // Filter buttons (built from actual tag data)
    buildFilterButtons(ALL_POSTS);

    // Initial card render
    renderCards();

    // Event listeners
    document.getElementById("searchInput").addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderCards();
    });
    document.getElementById("sortSelect").addEventListener("change", (e) => {
      sortOrder = e.target.value;
      renderCards();
    });
  } catch (err) {
    console.error("Failed to load posts:", err);
    document.getElementById("cardsGrid").innerHTML =
      `<p style="color:var(--coral);font-family:var(--font-m);font-size:13px;padding:20px;grid-column:1/-1">
        ⚠ Failed to load posts — check the console for details.
      </p>`;
  }
}

init();
