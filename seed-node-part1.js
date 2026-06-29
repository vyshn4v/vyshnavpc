import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "node-v8-engine",
    title: "1. Introduction to Node.js & V8",
    order: 1,
    content: "<h2>Understanding Node.js and the V8 Engine</h2><p>Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine...</p>",
    interviewQuestions: [
      { question: "What is the role of the V8 engine in Node.js?", answer: "It compiles JavaScript code into machine code for fast execution." },
      { question: "Can Node.js run without V8?", answer: "Node.js is strongly tied to V8, though alternative projects like Node-ChakraCore have existed." }
    ],
    practicalTask: {
      scenario: "You need to log runtime environment details.",
      task: "Write a script to log the V8 engine version.",
      solutionCode: "console.log(process.versions.v8);"
    }
  },
  {
    slug: "node-event-loop",
    title: "2. The Node.js Event Loop",
    order: 2,
    content: "<h2>The Heart of Node.js</h2><p>The event loop is what allows Node.js to perform non-blocking I/O operations...</p>",
    interviewQuestions: [
      { question: "What are the phases of the Event Loop?", answer: "Timers, pending callbacks, idle/prepare, poll, check, close callbacks." },
      { question: "What is libuv?", answer: "A multi-platform support library with a focus on asynchronous I/O, powering the Node.js event loop." }
    ],
    practicalTask: {
      scenario: "Demonstrating async execution order.",
      task: "Write a script using setTimeout and setImmediate to show order of execution.",
      solutionCode: "setTimeout(() => console.log('Timeout'), 0);\nsetImmediate(() => console.log('Immediate'));"
    }
  },
  {
    slug: "node-modules-cjs-esm",
    title: "3. Modules: CommonJS vs ESM",
    order: 3,
    content: "<h2>Module Systems in Node.js</h2><p>CommonJS uses require() and module.exports, whereas ESM uses import and export...</p>",
    interviewQuestions: [
      { question: "How do you enable ES modules in Node.js?", answer: "By setting \"type\": \"module\" in package.json or using the .mjs extension." },
      { question: "Can you use require() inside an ES module?", answer: "No, require is not defined in ES modules, but you can create it using module.createRequire." }
    ],
    practicalTask: {
      scenario: "Refactoring a CJS module to ESM.",
      task: "Export a function using ESM syntax.",
      solutionCode: "export const greet = (name) => `Hello ${name}`;"
    }
  },
  {
    slug: "node-package-management",
    title: "4. Package Management",
    order: 4,
    content: "<h2>npm, yarn, and pnpm</h2><p>Package managers allow developers to install, share, and distribute code...</p>",
    interviewQuestions: [
      { question: "What is the difference between dependencies and devDependencies?", answer: "dependencies are required for production, devDependencies are only for local development and testing." },
      { question: "What does package-lock.json do?", answer: "It locks the exact versions of installed packages to ensure consistent environments." }
    ],
    practicalTask: {
      scenario: "Initializing a project.",
      task: "Initialize a package.json programmatically or write out a basic package.json structure.",
      solutionCode: "{\n  \"name\": \"demo\",\n  \"version\": \"1.0.0\"\n}"
    }
  },
  {
    slug: "node-first-server",
    title: "5. Creating the First Server",
    order: 5,
    content: "<h2>Building a Server from Scratch</h2><p>Using the built-in HTTP module, you can create a basic web server...</p>",
    interviewQuestions: [
      { question: "How do you start a server using the core http module?", answer: "Using http.createServer() and then calling .listen() on the returned server instance." },
      { question: "Why avoid using core http module for large applications?", answer: "It lacks built-in routing, middleware support, and simplified request parsing." }
    ],
    practicalTask: {
      scenario: "You need a lightweight server without external dependencies.",
      task: "Write a simple HTTP server that responds with 'Hello World'.",
      solutionCode: "import http from 'http';\nhttp.createServer((req, res) => { res.end('Hello World'); }).listen(3000);"
    }
  }
];

appendTopics("nodejs", "Node.js Enterprise Backend", "The definitive guide.", topics);
