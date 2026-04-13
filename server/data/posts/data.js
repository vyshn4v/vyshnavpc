/* data/posts/nodejs-event-loop.js
   Full content for the "Understanding the Node.js Event Loop" post.
   This is passed as context to views/post.hbs via the Express route.
*/

const cat = require("../categories");
const posts = require("../posts");

// ─── Shared phase data (ring diagram + phase cards) ───────────────────────
const phases = [
  {
    num: "01",
    icon: "⏱",
    title: "Timers",
    accent: "#7c6ef7",
    color: "#a594ff",
    bg: "rgba(124,110,247,.12)",
    border: "rgba(165,148,255,.25)",
    desc: "Runs callbacks scheduled by <code>setTimeout()</code> and <code>setInterval()</code> whose delay threshold has been reached.",
    tag: "setTimeout / setInterval",
    shortName: "① Timers",
    name: "① Timers",
    detailDesc:
      "Executes callbacks scheduled by setTimeout() and setInterval() whose delay has expired.",
    bullets: [
      "Runs if delay threshold has passed",
      "setTimeout(fn,0) still waits until this phase",
      "Does NOT guarantee exact timing",
    ],
    pos: { x: 116, y: 4 },
  },
  {
    num: "02",
    icon: "🔄",
    title: "Pending I/O",
    accent: "#2dd4bf",
    color: "#5eead4",
    bg: "rgba(45,212,191,.1)",
    border: "rgba(94,234,212,.2)",
    desc: "Handles I/O callbacks deferred from the previous loop tick — mostly system-level errors like TCP socket errors.",
    tag: "deferred callbacks",
    shortName: "② Pending I/O",
    name: "② Pending I/O",
    detailDesc: "Handles I/O callbacks deferred from the previous iteration.",
    bullets: [
      "System-level error callbacks",
      "e.g. TCP ECONNREFUSED",
      "Most I/O runs in Poll instead",
    ],
    pos: { x: 232, y: 80 },
  },
  {
    num: "03",
    icon: "💤",
    title: "Idle / Prepare",
    accent: "#9090a8",
    color: "#b0b0c4",
    bg: "rgba(144,144,168,.08)",
    border: "rgba(144,144,168,.2)",
    desc: "Internal Node.js use only. Prepares state before entering the poll phase. Your code never runs here.",
    tag: "internal only",
    shortName: "③ Idle",
    name: "③ Idle/Prepare",
    detailDesc:
      "Internal Node.js housekeeping. Your JavaScript code never runs here.",
    bullets: [
      "Internal bookkeeping only",
      "Prepares for the Poll phase",
      "Not accessible from userland JS",
    ],
    pos: { x: 232, y: 190 },
  },
  {
    num: "04",
    icon: "👂",
    title: "Poll",
    accent: "#60a5fa",
    color: "#93c5fd",
    bg: "rgba(96,165,250,.1)",
    border: "rgba(147,197,253,.2)",
    desc: "Retrieves and executes new I/O events. If the queue is empty and no timers are ready, the loop <strong>blocks here</strong> waiting.",
    tag: "fs / net / http",
    shortName: "④ Poll",
    name: "④ Poll",
    detailDesc:
      "Retrieves and runs I/O callbacks. The loop blocks here if nothing else is pending.",
    bullets: [
      "Runs completed I/O callbacks",
      "Blocks waiting if queue empty + no timers",
      "Once timers ready, moves to Timers",
    ],
    pos: { x: 116, y: 268 },
  },
  {
    num: "05",
    icon: "✅",
    title: "Check",
    accent: "#4ade80",
    color: "#86efac",
    bg: "rgba(74,222,128,.1)",
    border: "rgba(134,239,172,.2)",
    desc: "Runs <code>setImmediate()</code> callbacks — always fires right after the Poll phase.",
    tag: "setImmediate",
    shortName: "⑤ Check",
    name: "⑤ Check",
    detailDesc:
      "Runs setImmediate() callbacks — always fires right after Poll.",
    bullets: [
      "setImmediate() runs here",
      "Fires before setTimeout(fn,0) inside I/O",
      "Predictable timing after Poll",
    ],
    pos: { x: 4, y: 190 },
  },
  {
    num: "06",
    icon: "🔒",
    title: "Close Events",
    accent: "#f87171",
    color: "#fca5a5",
    bg: "rgba(248,113,113,.1)",
    border: "rgba(252,165,165,.2)",
    desc: "Executes close callbacks like <code>socket.on('close')</code> and <code>process.on('exit')</code>.",
    tag: "socket.on('close')",
    shortName: "⑥ Close",
    name: "⑥ Close Events",
    detailDesc:
      "Fires close event callbacks and cleans up before the next loop iteration.",
    bullets: [
      'socket.on("close") callbacks',
      'process.on("exit") fires here',
      "Loop repeats or exits after this",
    ],
    pos: { x: 4, y: 80 },
  },
];

// ─── Full post context ─────────────────────────────────────────────────────
module.exports = {
  // Layout flags
  pageTitle: "Understanding the Node.js Event Loop",
  postPage: true,

  // Hero
  title: "Understanding the Node.js Event Loop",
  titleLine1: "Understanding the",
  titleLine2: "Event Loop",
  category: cat.nodejs,
  date: "Jan 2025",
  readTime: "8 min read",
  meta: { tags: "JavaScript · Node.js · Async" },
  lead: "The event loop is what allows Node.js to perform non-blocking I/O despite JavaScript being single-threaded. Here's a deep dive into every phase — and exactly what runs when.",

  // Overview section (rendered before dynamic sections)
  overview: {
    heading: "What is the Event Loop?",
    paragraphs: [
      "When you run a Node.js program, it starts executing your script top to bottom. Once the initial execution is done, instead of quitting, Node enters the <strong>event loop</strong> — a continuous cycle that checks for pending work, processes it, and loops again.",
      'This is what makes Node "non-blocking": while waiting for a file to read or a network response, Node can handle other events instead of sitting idle.',
    ],
    callout: {
      type: "info",
      icon: "💡",
      label: "Key insight:",
      text: "JavaScript is single-threaded, but Node uses the OS and libuv's thread pool for I/O. The event loop is the glue that brings results back to your JS code.",
    },
    closing:
      "The loop has <strong>6 distinct phases</strong>, each with its own queue of callbacks. Understanding which phase runs what is the key to mastering async code in Node.js.",
  },

  // Dynamic article sections — rendered in order by post.hbs
  sections: [
    // ── Phase cards ──
    {
      id: "phases",
      heading: "The 6 Phases",
      intro: "Each iteration of the loop moves through these phases in order:",
      phases, // renders the .phases-grid
    },

    // ── Interactive diagram ──
    {
      id: "demo",
      heading: "Interactive Demo",
      intro:
        "Click any phase to explore what runs there. Step through with the Prev / Next buttons.",
      loopDiagram: {
        label: "Node.js event loop — click a phase to inspect",
        phases, // reuses the same phase objects
      },
    },

    // ── Code example ──
    {
      id: "code",
      heading: "See It in Code",
      intro: "Can you predict the output order before running this snippet?",
      codeBlock: {
        lang: "javascript",
        html: [
          '<span class="cm">// What\'s the output order?</span>',
          "",
          '<span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\'1. script start\'</span>);',
          "",
          '<span class="fn">setTimeout</span>(<span class="punc">()</span> <span class="kw">=></span> <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\'4. setTimeout\'</span>), <span class="num">0</span>);',
          '<span class="fn">setImmediate</span>(<span class="punc">()</span> <span class="kw">=></span> <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\'5. setImmediate\'</span>));',
          '<span class="fn">Promise</span>.<span class="fn">resolve</span>().<span class="fn">then</span>(<span class="punc">()</span> <span class="kw">=></span> <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\'3. Promise microtask\'</span>));',
          '<span class="fn">process</span>.<span class="fn">nextTick</span>(<span class="punc">()</span> <span class="kw">=></span> <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\'2. nextTick\'</span>));',
          "",
          '<span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\'1. script end\'</span>);',
        ].join("\n"),
      },
      callout: {
        type: "tip",
        icon: "✅",
        label: "Output:",
        text: "script start → script end → nextTick → Promise → setTimeout → setImmediate. Microtasks always flush before the loop moves on!",
      },
    },

    // ── Comparison table ──
    {
      heading: "setTimeout vs setImmediate vs nextTick",
      intro:
        "These three are the most commonly confused. Here's a clear comparison:",
      table: {
        headers: ["Function", "Runs in", "Priority", "Use when"],
        rows: [
          {
            fn: "process.nextTick()",
            runsIn: "Between any two phases",
            badgeClass: "fast",
            priority: "Highest",
            useWhen: "Defer but stay before any I/O",
          },
          {
            fn: "Promise.then()",
            runsIn: "Microtask queue",
            badgeClass: "fast",
            priority: "High",
            useWhen: "Standard async/await patterns",
          },
          {
            fn: "setImmediate()",
            runsIn: "Check phase",
            badgeClass: "med",
            priority: "Medium",
            useWhen: "After Poll — inside I/O callbacks",
          },
          {
            fn: "setTimeout(fn, 0)",
            runsIn: "Timers phase",
            badgeClass: "slow",
            priority: "Lower",
            useWhen: "Delay by at least N ms",
          },
        ],
      },
    },

    // ── Microtasks ──
    {
      id: "microtasks",
      heading: "Microtasks: The Hidden Layer",
      paragraphs: [
        "Microtasks don't belong to any phase — they run <strong>between every phase transition</strong>. A resolved Promise callback always runs before the loop can move on.",
      ],
      banner: {
        icon: "⚡",
        title: "Microtask Queue",
        text: "After each phase, Node drains the entire microtask queue before moving on. <strong>process.nextTick()</strong> runs first — before Promise callbacks — making it the highest-priority async mechanism in Node.",
      },
      callout: {
        type: "warn",
        icon: "⚠️",
        label: "Watch out:",
        text: "If you recursively call <code>process.nextTick()</code> you can starve the event loop — I/O callbacks will never run because the microtask queue never empties.",
      },
    },

    // ── TL;DR ──
    {
      heading: "TL;DR",
      codeBlock: {
        lang: "text",
        html: [
          '<span class="cm">Each loop iteration:</span>',
          "",
          '  <span class="tag-c">1. Timers</span>        <span class="cm">→ setTimeout / setInterval callbacks</span>',
          '  <span class="tag-c">2. Pending I/O</span>   <span class="cm">→ deferred system callbacks</span>',
          '  <span class="tag-c">3. Idle/Prepare</span>  <span class="cm">→ internal, skip</span>',
          '  <span class="tag-c">4. Poll</span>          <span class="cm">→ I/O events; may block waiting</span>',
          '  <span class="tag-c">5. Check</span>         <span class="cm">→ setImmediate callbacks</span>',
          '  <span class="tag-c">6. Close</span>         <span class="cm">→ socket.on(\'close\') etc.</span>',
          "",
          '  <span class="kw">⚡ Between EVERY phase:</span> drain microtasks (nextTick, then Promises)',
        ].join("\n"),
      },
    },
  ],

  // Post footer
  footer: {
    credit: "Written for developers who want to understand Node.js deeply.",
    tags: ["Node.js", "JavaScript", "async", "event-loop", "libuv"],
  },

  // Related posts (pulled from posts list, excluding self)
  related: require("../posts")
    .filter(
      (p) => p.slug !== "nodejs-event-loop" && p.category.slug === "nodejs",
    )
    .slice(0, 3),
};
