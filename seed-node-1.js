import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'nodejs-event-loop',
    title: 'The Event Loop',
    order: 1,
    content: `
## The Event Loop

### 1. Conceptual Overview
The Event Loop is the secret behind Node.js's asynchronous, non-blocking I/O model. Despite Node.js being single-threaded, the Event Loop offloads operations to the system kernel whenever possible, allowing Node.js to handle thousands of concurrent connections efficiently.

### 2. Architecture & Mechanics
The Event Loop consists of several phases, executed in a specific order:
1. **Timers**: executes callbacks scheduled by \`setTimeout()\` and \`setInterval()\`.
2. **Pending Callbacks**: executes I/O callbacks deferred to the next loop iteration.
3. **Idle, Prepare**: only used internally.
4. **Poll**: retrieve new I/O events; execute I/O related callbacks.
5. **Check**: \`setImmediate()\` callbacks are invoked here.
6. **Close Callbacks**: e.g., \`socket.on('close', ...)\`.

Between each phase, Node.js checks for any resolved Promises and \`process.nextTick()\` queues.

### 3. Implementation: Standard vs Optimized
**Standard (Blocking):**
Running CPU-intensive tasks directly in the event loop blocks it.
\`\`\`javascript
function blockLoop() {
  const start = Date.now();
  while (Date.now() - start < 1000) {}
  console.log('Blocked for 1s');
}
\`\`\`

**Optimized (Non-Blocking):**
Offload CPU-intensive tasks using Worker Threads.
\`\`\`javascript
const { Worker } = require('worker_threads');
function runWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./heavyTask.js');
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}
\`\`\`

### 4. Trade-offs & Complexity
- **Pros:** High concurrency for I/O bound tasks, lightweight, single language (JavaScript) for front-end and back-end.
- **Cons:** Not suitable for heavy CPU-bound tasks (e.g., video encoding). Callback hell (though mitigated by async/await).
`,
    interviewQuestions: [
      { question: "What is the Event Loop in Node.js?", answer: "The Event Loop is the mechanism that allows Node.js to perform non-blocking I/O operations despite being single-threaded, by offloading operations to the system kernel." },
      { question: "What are the main phases of the Event Loop?", answer: "Timers, Pending Callbacks, Idle/Prepare, Poll, Check, and Close Callbacks." },
      { question: "What is the difference between setImmediate() and setTimeout()?", answer: "setImmediate() is designed to execute a script once the current poll phase completes. setTimeout() schedules a script to run after a minimum threshold in ms has elapsed." },
      { question: "How does process.nextTick() relate to the Event Loop?", answer: "process.nextTick() is not technically part of the Event Loop. Its callbacks are processed after the current operation is completed, regardless of the current phase of the Event Loop." },
      { question: "How do you avoid blocking the Event Loop?", answer: "By writing asynchronous I/O operations and offloading heavy CPU-bound tasks to Worker Threads or separate processes." }
    ],
    practicalTask: {
      scenario: "You need to verify the execution order of different async functions.",
      task: "Write a script that uses setTimeout, setImmediate, process.nextTick, and a Promise to log messages, demonstrating their execution order.",
      solutionCode: `
console.log('Start');
setTimeout(() => console.log('Timeout'), 0);
setImmediate(() => console.log('Immediate'));
Promise.resolve().then(() => console.log('Promise'));
process.nextTick(() => console.log('NextTick'));
console.log('End');
// Order: Start, End, NextTick, Promise, Timeout/Immediate
      `
    }
  },
  {
    slug: 'nodejs-streams',
    title: 'Node.js Streams',
    order: 2,
    content: `
## Node.js Streams

### 1. Conceptual Overview
Streams are a way to handle reading/writing files, network communications, or any kind of end-to-end information exchange in an efficient way. Instead of reading an entire file into memory, streams read chunks of data piece by piece.

### 2. Architecture & Mechanics
There are four fundamental stream types in Node.js:
- **Readable**: Streams from which data can be read (e.g., \`fs.createReadStream()\`).
- **Writable**: Streams to which data can be written (e.g., \`fs.createWriteStream()\`).
- **Duplex**: Streams that are both Readable and Writable (e.g., \`net.Socket\`).
- **Transform**: Duplex streams that can modify or transform the data as it is written and read (e.g., \`zlib.createDeflate()\`).

### 3. Implementation: Standard vs Optimized
**Standard (Buffering):**
Reading a whole file into memory.
\`\`\`javascript
const fs = require('fs');
fs.readFile('largeFile.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});
\`\`\`

**Optimized (Streaming):**
Processing data piece by piece.
\`\`\`javascript
const fs = require('fs');
const readStream = fs.createReadStream('largeFile.txt');
readStream.on('data', chunk => {
  console.log(chunk);
});
\`\`\`

### 4. Trade-offs & Complexity
- **Pros:** Memory efficiency (processes data in chunks instead of loading entirely), time efficiency (can start processing before the whole file is read).
- **Cons:** Steeper learning curve, complex error handling (errors need to be handled on every stream in a pipeline).
`,
    interviewQuestions: [
      { question: "What are streams in Node.js?", answer: "Streams are collections of data that might not be available all at once and don't have to fit in memory. They allow you to process data continuously chunk by chunk." },
      { question: "What are the four types of streams?", answer: "Readable, Writable, Duplex, and Transform." },
      { question: "What is backpressure in streams?", answer: "Backpressure occurs when the data is being sent from a Readable stream faster than the Writable stream can process it, causing a buildup in memory." },
      { question: "How does the pipe() method work?", answer: "pipe() attaches a Writable stream to a Readable stream, automatically managing the flow of data and handling backpressure." },
      { question: "What is a Transform stream?", answer: "A Transform stream is a type of Duplex stream where the output is computed in some way from the input, like compression or encryption streams." }
    ],
    practicalTask: {
      scenario: "You need to copy a large file efficiently without consuming too much memory.",
      task: "Write a script using streams and the pipeline utility to copy 'source.txt' to 'destination.txt'.",
      solutionCode: `
const fs = require('fs');
const { pipeline } = require('stream');

const readStream = fs.createReadStream('source.txt');
const writeStream = fs.createWriteStream('destination.txt');

pipeline(readStream, writeStream, (err) => {
  if (err) console.error('Pipeline failed.', err);
  else console.log('Pipeline succeeded.');
});
      `
    }
  },
  {
    slug: 'nodejs-modules',
    title: 'Module System',
    order: 3,
    content: `
## Module System

### 1. Conceptual Overview
Node.js treats each file as a separate module. This modularity is essential for organizing code, encapsulating logic, and managing dependencies. Node historically used CommonJS (CJS) but now fully supports ECMAScript Modules (ESM).

### 2. Architecture & Mechanics
**CommonJS (CJS):**
Uses \`require()\` to load modules and \`module.exports\` to export them. They are loaded synchronously.
**ECMAScript Modules (ESM):**
Uses \`import\` to load modules and \`export\` to export them. They are loaded asynchronously. To use ESM, you can set \`"type": "module"\` in \`package.json\` or use the \`.mjs\` extension.

### 3. Implementation: Standard vs Optimized
**Standard (CommonJS):**
\`\`\`javascript
// math.js
module.exports = { add: (a, b) => a + b };
// app.js
const math = require('./math.js');
\`\`\`

**Optimized (ES Modules):**
Enables tree-shaking and modern syntax.
\`\`\`javascript
// math.mjs
export const add = (a, b) => a + b;
// app.mjs
import { add } from './math.mjs';
\`\`\`

### 4. Trade-offs & Complexity
- **Pros (ESM):** Standardized, supports tree-shaking, static analysis.
- **Cons (ESM):** Ecosystem transition issues, requires explicit file extensions in Node, asynchronous nature can complicate some dynamic imports.
`,
    interviewQuestions: [
      { question: "What is the difference between CommonJS and ES Modules?", answer: "CommonJS uses require/module.exports and is synchronous. ES Modules use import/export, are asynchronous, and are the official JavaScript standard." },
      { question: "How do you enable ES Modules in a Node.js project?", answer: "By adding \\\"type\\\": \\\"module\\\" to the package.json file, or by using the .mjs file extension." },
      { question: "What is the purpose of the package.json file?", answer: "It holds metadata relevant to the project, manages dependencies, defines scripts, and configures project settings like the module system." },
      { question: "Can you use require() inside an ES Module?", answer: "No, require() is not defined in ES Modules. You must use import, or create a custom require using module.createRequire(import.meta.url)." },
      { question: "What is dynamic import?", answer: "Dynamic import() allows you to load modules asynchronously at runtime, returning a promise. It's useful for lazy loading." }
    ],
    practicalTask: {
      scenario: "You are building a utility library using modern syntax.",
      task: "Create an ES module that exports a greeting function, and dynamically import it into an application file.",
      solutionCode: `
// greet.mjs
export function greet(name) { return \\\`Hello, \\\${name}\\\`; }

// app.mjs
async function run() {
  const { greet } = await import('./greet.mjs');
  console.log(greet('World'));
}
run();
      `
    }
  },
  {
    slug: 'nodejs-error-handling',
    title: 'Error Handling',
    order: 4,
    content: `
## Error Handling

### 1. Conceptual Overview
Proper error handling in Node.js ensures the application doesn't crash unexpectedly and provides meaningful feedback. Node.js errors can be broadly categorized into operational errors (expected issues like network failure) and programmer errors (bugs).

### 2. Architecture & Mechanics
Errors in Node.js are typically handled using:
- **Callbacks**: Error-first callbacks (\`callback(err, result)\`).
- **Promises**: \`.catch()\` blocks.
- **Async/Await**: \`try...catch\` blocks.
- **Event Emitters**: Listening to the \`'error'\` event.

Uncaught exceptions and unhandled promise rejections will crash the Node.js process unless explicitly caught, though handling them globally is generally just for graceful shutdown.

### 3. Implementation: Standard vs Optimized
**Standard (Callback Error Handling):**
\`\`\`javascript
const fs = require('fs');
fs.readFile('nonexistent.txt', (err, data) => {
  if (err) {
    console.error('File read error:', err.message);
    return;
  }
  console.log(data);
});
\`\`\`

**Optimized (Async/Await with Try/Catch):**
\`\`\`javascript
const fs = require('fs').promises;
async function readDoc() {
  try {
    const data = await fs.readFile('nonexistent.txt');
    console.log(data);
  } catch (err) {
    console.error('File read error:', err.message);
  }
}
\`\`\`

### 4. Trade-offs & Complexity
- **Pros:** Robust applications, easier debugging, prevents state corruption.
- **Cons:** Boilerplate code, easily missed if not careful (e.g., forgetting a \`.catch()\` on a Promise or an \`'error'\` listener on an EventEmitter).
`,
    interviewQuestions: [
      { question: "What is the 'error-first callback' pattern?", answer: "It's a convention in Node.js where the first argument of a callback function is reserved for an error object. If successful, the first argument is null." },
      { question: "What happens if an EventEmitter emits an 'error' event and there are no listeners attached?", answer: "Node.js will treat it as an uncaught exception, print the stack trace, and exit the process." },
      { question: "How should you handle an unhandled promise rejection?", answer: "Listen to the process.on('unhandledRejection', callback) event, log the error, and gracefully shut down the application." },
      { question: "What is the difference between an operational error and a programmer error?", answer: "Operational errors represent runtime problems (e.g., file not found, DB connection failed). Programmer errors are bugs in the code (e.g., syntax errors, reading properties of undefined)." },
      { question: "Why is it dangerous to ignore uncaught exceptions?", answer: "Ignoring them leaves the application in an unpredictable state, potentially leading to memory leaks, corrupted data, and strange behavior. The process should be restarted." }
    ],
    practicalTask: {
      scenario: "You are setting up an application and need to ensure unhandled promise rejections are logged before exit.",
      task: "Write a script that listens for 'unhandledRejection', logs the error, and exits the process with a failure code.",
      solutionCode: `
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Perform cleanup
  process.exit(1);
});

// Triggering the rejection
Promise.reject(new Error('Oops!'));
      `
    }
  },
  {
    slug: 'nodejs-performance',
    title: 'Performance Optimization',
    order: 5,
    content: `
## Performance Optimization

### 1. Conceptual Overview
Optimizing a Node.js application involves improving response times, reducing memory usage, and maximizing throughput. Since Node.js is single-threaded, ensuring the event loop isn't blocked is paramount.

### 2. Architecture & Mechanics
Key strategies for optimization:
- **Clustering**: Forking multiple Node.js processes (usually one per CPU core) to share the workload.
- **Worker Threads**: Executing CPU-intensive tasks in parallel threads without blocking the main event loop.
- **Caching**: Storing frequently accessed data in memory (e.g., Redis).
- **Load Balancing**: Distributing incoming network traffic across multiple servers.

### 3. Implementation: Standard vs Optimized
**Standard (Single Process):**
\`\`\`javascript
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Hello World');
}).listen(8000);
\`\`\`

**Optimized (Clustering):**
\`\`\`javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello World');
  }).listen(8000);
}
\`\`\`

### 4. Trade-offs & Complexity
- **Pros:** Can fully utilize multi-core systems, handles high traffic, reduces latency.
- **Cons:** Increased architectural complexity, state management becomes harder (need distributed stores like Redis instead of in-memory variables), higher resource consumption.
`,
    interviewQuestions: [
      { question: "What is the Cluster module in Node.js used for?", answer: "The cluster module allows you to easily create child processes (workers) that run simultaneously and share the same server port, utilizing multi-core systems." },
      { question: "How do Worker Threads differ from Clusters?", answer: "Clusters run separate Node.js processes with their own memory space. Worker Threads run within a single process, allowing them to share memory (via SharedArrayBuffer), making them better suited for CPU-bound tasks within the same application." },
      { question: "Why shouldn't you store session data in memory when using clustering?", answer: "Because each worker process has its own isolated memory. A request from the same user might be routed to a different worker that doesn't have the session data. You should use a centralized store like Redis." },
      { question: "What are some common tools to profile a Node.js application for memory leaks?", answer: "Tools like Chrome DevTools (using node --inspect), clinic.js, or heapdump can be used to take heap snapshots and analyze memory usage." },
      { question: "How does caching improve Node.js performance?", answer: "Caching stores the results of expensive operations (like DB queries or API calls) in memory, allowing subsequent requests for the same data to be served much faster without recomputing or refetching." }
    ],
    practicalTask: {
      scenario: "You need to utilize all CPU cores for an HTTP server.",
      task: "Write a script utilizing the cluster module that forks workers for every CPU core and starts an HTTP server in the workers.",
      solutionCode: `
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  console.log(\\\`Primary \\\${process.pid} is running\\\`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(\\\`worker \\\${worker.process.pid} died\\\`);
  });
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello, World!');
  }).listen(8000);
  console.log(\\\`Worker \\\${process.pid} started\\\`);
}
      `
    }
  }
];

appendTopics('nodejs', 'Node.js Masterclass', 'Comprehensive guide to mastering Node.js architecture and mechanics.', topics);
