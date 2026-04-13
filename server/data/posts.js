/* data/posts.js
   Master list of all blog posts.
   Each entry feeds a card on the home/listing page.
   The full post content lives in data/posts/<slug>.js
*/

const cat = require("./categories");

const posts = [
  {
    slug: "nodejs-event-loop",
    title: "Understanding the Node.js Event Loop",
    excerpt:
      "A deep dive into all 6 phases of the event loop — timers, poll, check, and everything in between. Learn exactly what runs when.",
    category: cat.nodejs,
    date: "Jan 2025",
    readTime: "8 min read",
    tags: ["Node.js", "async", "libuv"],
    featured: true,
  },
  // {
  //   slug: "js-promises-vs-async-await",
  //   title: "Promises vs Async/Await: What Actually Changes?",
  //   excerpt:
  //     "Async/await is syntactic sugar — but knowing what it compiles to will save you hours of debugging. Let's unwrap it.",
  //   category: cat.javascript,
  //   date: "Feb 2025",
  //   readTime: "6 min read",
  //   tags: ["async", "promises", "ES2017"],
  //   featured: false,
  // },
  // {
  //   slug: "css-cascade-layers",
  //   title: "CSS Cascade Layers Explained",
  //   excerpt:
  //     "Finally a way to manage specificity at scale. @layer gives you explicit control over the cascade without !important hacks.",
  //   category: cat.css,
  //   date: "Mar 2025",
  //   readTime: "5 min read",
  //   tags: ["CSS", "cascade", "@layer"],
  //   featured: false,
  // },
  // {
  //   slug: "node-streams-backpressure",
  //   title: "Node.js Streams & Backpressure",
  //   excerpt:
  //     "Streams are powerful but misunderstood. Learn how backpressure works and why ignoring it causes silent memory leaks.",
  //   category: cat.nodejs,
  //   date: "Mar 2025",
  //   readTime: "10 min read",
  //   tags: ["Node.js", "streams", "memory"],
  //   featured: false,
  // },
  // {
  //   slug: "vite-vs-webpack",
  //   title: "Vite vs Webpack in 2025",
  //   excerpt:
  //     "Vite has won the developer experience war — but webpack still has its place. Here's an honest, data-driven comparison.",
  //   category: cat.tools,
  //   date: "Apr 2025",
  //   readTime: "7 min read",
  //   tags: ["Vite", "Webpack", "bundling"],
  //   featured: false,
  // },
  // {
  //   slug: "js-prototypes-deep-dive",
  //   title: "JavaScript Prototypes: The Full Picture",
  //   excerpt:
  //     "Classes in JS are beautiful lies. Understanding the prototype chain underneath is what separates good developers from great ones.",
  //   category: cat.javascript,
  //   date: "Apr 2025",
  //   readTime: "9 min read",
  //   tags: ["JavaScript", "OOP", "prototype"],
  //   featured: false,
  // },
];

module.exports = posts;
