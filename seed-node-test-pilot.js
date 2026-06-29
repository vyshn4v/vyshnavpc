import { appendTopics } from './seeder-utils.js';

const conceptualBase = `Node.js fundamentally redefines how we think about concurrent processing in backend development. Unlike traditional thread-per-request models (like early Apache HTTP Server or standard Java web servers), Node.js operates on a single-threaded, event-driven architecture using the Reactor Pattern. This model is built upon the V8 JavaScript engine and the libuv library, which abstracts the non-blocking I/O operations and provides the event loop implementation. To truly master Node.js, one must shift their mental model from concurrent execution across multiple threads to concurrent scheduling and asynchronous callback delegation.

In traditional backend systems, every incoming network request is assigned a dedicated thread. If a request involves reading a file or querying a database, the thread becomes blocked—it simply waits idly until the I/O operation completes. This leads to massive overhead in context switching and memory allocation as the number of concurrent connections scales up. Node.js takes a drastically different approach. When an I/O request is made, Node.js offloads the actual work to the operating system's asynchronous interfaces (like epoll on Linux, kqueue on macOS, or IOCP on Windows) or to the libuv thread pool for operations that lack native non-blocking support (such as file system operations or DNS lookups). The main thread immediately continues executing the next available synchronous code. This allows a single Node.js process to handle tens of thousands of concurrent connections with minimal memory footprint.

Consider the mental model of a highly efficient restaurant kitchen. In a thread-per-request model, each waiter (thread) takes an order, walks into the kitchen, and waits by the stove until the chef (I/O) finishes cooking the meal before delivering it to the table. If you have 100 tables, you need 100 waiters, and 90 of them are just standing around in the kitchen waiting. In the Node.js model, there is only one highly efficient waiter (the Event Loop). The waiter takes an order, passes it to the kitchen staff (libuv/OS), and immediately returns to the dining room to take the next order. When a meal is ready, the kitchen rings a bell (pushes a callback to the event queue), and the waiter picks it up to deliver it. This allows a single waiter to serve hundreds of tables efficiently, provided the waiter never decides to cook a meal themselves (which represents running CPU-bound, blocking operations on the main thread).

This paradigm requires developers to strictly adhere to asynchronous patterns. Callbacks, Promises, and async/await are not just syntactic sugar; they are fundamental mechanics for deferring execution. Understanding this enables engineers to design highly scalable microservices, real-time communication servers, and API gateways that thrive under immense I/O loads. However, the caveat is always the same: do not block the event loop. A single CPU-intensive calculation, like parsing a massive JSON payload synchronously or computing cryptographic hashes on the main thread, acts like the single waiter stopping to cook a meal—the entire restaurant grinds to a halt. Therefore, mastering Node.js means mastering the art of offloading, delegating, and orchestrating asynchronous workflows without ever monopolizing the main execution thread.

Node.js is a runtime environment that executes JavaScript outside of a browser. By abstracting away the complex C++ code of libuv and V8, it provides a unified, elegant API for interacting with the underlying system. The true beauty of Node.js lies in its ecosystem, its unyielding commitment to non-blocking principles, and its ability to unify frontend and backend engineering under a single language. As you delve deeper into the event loop, streams, and worker threads, keep this foundational Reactor Pattern at the forefront of your mind. It is the key to unlocking the full potential of high-performance Node.js enterprise applications.
`;

const topics = [
  {
    title: "1. Event Loop Fundamentals",
    slug: "event-loop-fundamentals",
    order: 1,
    content: `### 1. Conceptual Overview
${conceptualBase}
This chapter focuses specifically on the intricacies of the event loop and how asynchronous operations are managed.

### 2. Architecture & Mechanics
The event loop is the beating heart of Node.js. It is a C program (provided by libuv) that continuously checks for pending events and executes their corresponding callbacks. The event loop is divided into distinct phases, each with its own FIFO queue of callbacks to process: Timers Phase, Pending Callbacks Phase, Idle/Prepare Phase, Poll Phase, Check Phase, and Close Callbacks Phase. Microtasks (process.nextTick, resolved promises) are drained completely between each phase.

### 3. Implementation: Standard vs Optimized

\`\`\`javascript
// BRUTE FORCE: Synchronous blocking code
const fs = require('fs');
function readSync() {
  // Blocks the event loop entirely
  const data = fs.readFileSync('/large-file.txt');
  console.log('Read finished');
}
\`\`\`

\`\`\`javascript
// OPTIMIZED: Asynchronous non-blocking code
const fs = require('fs');
function readAsync() {
  fs.readFile('/large-file.txt', (err, data) => {
    if (err) throw err;
    console.log('Read finished without blocking');
  });
}
\`\`\`

### 4. Trade-offs & Complexity
- **Time Complexity:** O(1) scheduling for asynchronous operations.
- **Space Complexity:** O(N) where N is the number of pending callbacks in the queues.
- **Trade-offs:** Asynchrony vastly improves throughput for I/O bound applications but adds significant cognitive load and complexity to code tracing and debugging.`,
    interviewQuestions: [
      { question: "What is the Reactor Pattern?", answer: "An event-driven architectural pattern used in Node.js to handle non-blocking I/O operations via an event loop." },
      { question: "What is libuv?", answer: "A multi-platform support library with a focus on asynchronous I/O, providing the event loop and thread pool for Node.js." },
      { question: "What happens in the Poll phase?", answer: "The event loop calculates how long it should block and poll for I/O, then processes events in the poll queue." },
      { question: "How does process.nextTick differ from setImmediate?", answer: "nextTick executes immediately after the current operation before the next phase, while setImmediate executes in the Check phase." },
      { question: "Why is Node.js single-threaded?", answer: "It executes JavaScript on a single thread to avoid concurrency issues like deadlocks, relying on asynchronous I/O for concurrency." }
    ],
    practicalTask: {
      scenario: "You need to prevent an infinite loop of microtasks from starving the event loop.",
      task: "Refactor a recursive process.nextTick implementation to allow the event loop to breathe.",
      solutionCode: "function asyncTask() { setImmediate(() => asyncTask()); } // using setImmediate instead of nextTick"
    }
  },
  {
    title: "2. Streams and Buffer Management",
    slug: "streams-buffer-management",
    order: 2,
    content: `### 1. Conceptual Overview
${conceptualBase}
This chapter explores how Node.js handles data flows and memory via Streams and Buffers.

### 2. Architecture & Mechanics
Streams are instances of EventEmitter representing asynchronous flows of data. They come in four types: Readable, Writable, Duplex, and Transform. Buffers are objects that represent fixed-length sequences of bytes, used to handle binary data directly in memory outside the V8 heap. By processing data in chunks rather than loading entire payloads into memory, streams drastically reduce the memory footprint.

### 3. Implementation: Standard vs Optimized

\`\`\`javascript
// BRUTE FORCE: Reading whole file into memory
const fs = require('fs');
const server = require('http').createServer();
server.on('request', (req, res) => {
  fs.readFile('./big.file', (err, data) => {
    if (err) throw err;
    res.end(data);
  });
});
\`\`\`

\`\`\`javascript
// OPTIMIZED: Piping a read stream directly to response
const fs = require('fs');
const server = require('http').createServer();
server.on('request', (req, res) => {
  const src = fs.createReadStream('./big.file');
  src.pipe(res);
});
\`\`\`

### 4. Trade-offs & Complexity
- **Time Complexity:** O(N) to process an N-byte file, but execution is distributed.
- **Space Complexity:** O(C) where C is the chunk size, usually 64KB.
- **Trade-offs:** Streams are highly memory efficient but require complex event management and careful handling of backpressure to avoid overflowing writable buffers.`,
    interviewQuestions: [
      { question: "What is a Buffer in Node.js?", answer: "A globally available class used to represent fixed-length sequences of raw binary data." },
      { question: "What is the difference between Duplex and Transform streams?", answer: "Duplex implements both Readable and Writable independently, while Transform is a Duplex stream where the output is computed in some way from the input." },
      { question: "What is backpressure?", answer: "A situation where a data source is producing data faster than the destination can consume it, potentially causing memory issues." },
      { question: "How does 'pipe' handle backpressure?", answer: "It automatically listens to 'drain' and 'data' events to pause and resume the readable stream, managing memory efficiently." },
      { question: "Are Buffers allocated on the V8 heap?", answer: "No, they are allocated outside the V8 heap using C++ directly, making them more suitable for large binary data." }
    ],
    practicalTask: {
      scenario: "You need to compress a large file efficiently.",
      task: "Implement a streaming file compression pipeline using zlib.",
      solutionCode: "const { pipeline } = require('stream'); const fs = require('fs'); const zlib = require('zlib'); pipeline(fs.createReadStream('in.txt'), zlib.createGzip(), fs.createWriteStream('out.gz'), (err) => { if (err) console.error(err); });"
    }
  },
  {
    title: "3. Concurrency and Worker Threads",
    slug: "concurrency-worker-threads",
    order: 3,
    content: `### 1. Conceptual Overview
${conceptualBase}
This chapter delves into overcoming the single-threaded limitation for CPU-bound tasks using Worker Threads.

### 2. Architecture & Mechanics
While Node.js is single-threaded for JS execution, the \`worker_threads\` module enables true parallel execution of JavaScript. Unlike \`child_process\`, worker threads share memory (via SharedArrayBuffer) and execute within the same parent process. Each worker has its own V8 instance, Event Loop, and Node.js environment, isolated from the main thread but capable of communicating efficiently via message passing.

### 3. Implementation: Standard vs Optimized

\`\`\`javascript
// BRUTE FORCE: Blocking CPU intensive task
app.get('/heavy', (req, res) => {
  let count = 0;
  for(let i=0; i<10000000000; i++) count++; // Blocks main thread
  res.send({ count });
});
\`\`\`

\`\`\`javascript
// OPTIMIZED: Offloading to a Worker Thread
const { Worker } = require('worker_threads');
app.get('/heavy', (req, res) => {
  const worker = new Worker('./heavy-worker.js');
  worker.on('message', count => res.send({ count }));
  worker.on('error', err => res.status(500).send(err.message));
});
\`\`\`

### 4. Trade-offs & Complexity
- **Time Complexity:** Parallel execution reduces wall-clock time from O(N*M) to O(N*M / cores).
- **Space Complexity:** O(W) overhead per worker (approx 20-30MB of RAM for V8 instances).
- **Trade-offs:** True parallelism prevents event loop blocking, but introduces heavy memory overhead per thread and complex synchronization if sharing memory.`,
    interviewQuestions: [
      { question: "Why use Worker Threads instead of Child Processes?", answer: "Worker threads are lighter and can share memory via SharedArrayBuffer, whereas child processes are entirely separate OS processes." },
      { question: "Do worker threads share the same event loop?", answer: "No, each worker thread gets its own independent Event Loop and V8 instance." },
      { question: "When should you NOT use worker threads?", answer: "For I/O bound operations. Worker threads are exclusively meant for CPU-heavy tasks." },
      { question: "How do you pass data between the main thread and workers?", answer: "Using the MessagePort API (postMessage and 'message' events) or SharedArrayBuffer." },
      { question: "What is a SharedArrayBuffer?", answer: "A memory object that can be shared between threads, allowing them to read and write the same data concurrently." }
    ],
    practicalTask: {
      scenario: "You need to sort a massive array without blocking the server.",
      task: "Spawn a worker thread to sort the array and return the result.",
      solutionCode: "const { Worker } = require('worker_threads'); const worker = new Worker('./sorter.js', { workerData: massiveArray }); worker.on('message', sorted => console.log(sorted));"
    }
  },
  {
    title: "4. Architecture & Design Patterns",
    slug: "architecture-design-patterns",
    order: 4,
    content: `### 1. Conceptual Overview
${conceptualBase}
This chapter explores enterprise-grade architectural design patterns for Node.js backends.

### 2. Architecture & Mechanics
A robust Node.js application avoids monolithic spaghetti code by adhering to structured design patterns like Dependency Injection, Repository Pattern, and modular domain-driven design. Because Node.js handles state within a single long-running process, global state mutation can cause disastrous cross-request data bleed. Clean architecture separates routing, business logic, and data access into distinct layers.

### 3. Implementation: Standard vs Optimized

\`\`\`javascript
// BRUTE FORCE: Spaghetti Monolith
app.post('/user', async (req, res) => {
  const { name, email } = req.body;
  // Direct DB call in router
  const user = await db.query('INSERT INTO users...', [name, email]);
  // Direct email trigger
  sendWelcomeEmail(email); 
  res.json(user);
});
\`\`\`

\`\`\`javascript
// OPTIMIZED: Clean Architecture / Controller-Service Pattern
class UserController {
  constructor(userService) {
    this.userService = userService;
  }
  async createUser(req, res) {
    const user = await this.userService.createUser(req.body);
    res.json(user);
  }
}
// Service handles business logic and event emission
\`\`\`

### 4. Trade-offs & Complexity
- **Time Complexity:** Negligible performance overhead for function delegation.
- **Space Complexity:** O(1) architectural overhead, though excessive abstraction creates memory fragmentation.
- **Trade-offs:** Clean architecture dramatically improves testability and maintainability, but introduces boilerplate and indirection that slows down initial prototyping.`,
    interviewQuestions: [
      { question: "What is cross-request state pollution?", answer: "When global variables or singleton state is modified during one request, inadvertently affecting subsequent requests in the same Node.js process." },
      { question: "Why is the Singleton pattern dangerous in Node.js?", answer: "Because it persists across multiple concurrent requests, making it easy to accidentally leak data between users." },
      { question: "What is Dependency Injection?", answer: "A design pattern where objects are passed into a class rather than instantiated within it, vastly improving unit testability." },
      { question: "How does the EventEmitter pattern help architecture?", answer: "It decouples components, allowing side effects (like sending emails) to be triggered without hardcoding dependencies." },
      { question: "What is Domain-Driven Design (DDD)?", answer: "A structural approach that centers the codebase around the business domain, organizing code by features rather than technical layers." }
    ],
    practicalTask: {
      scenario: "You need to decouple an email notification from user registration.",
      task: "Refactor synchronous email sending using Node's EventEmitter.",
      solutionCode: "const EventEmitter = require('events'); const bus = new EventEmitter(); bus.on('user_registered', sendEmail); // In controller: bus.emit('user_registered', user);"
    }
  },
  {
    title: "5. Profiling and Memory Diagnostics",
    slug: "profiling-memory-diagnostics",
    order: 5,
    content: `### 1. Conceptual Overview
${conceptualBase}
This chapter covers identifying, diagnosing, and resolving performance bottlenecks and memory leaks in production Node.js applications.

### 2. Architecture & Mechanics
V8 manages memory using a generational garbage collector (GC), split into New Space (scavenger) and Old Space (mark-and-sweep). Memory leaks occur when objects are kept alive indefinitely by lingering references (e.g., forgotten event listeners, global variables, or massive closures). Profiling involves taking heap snapshots, generating CPU profiles, and analyzing them in tools like Chrome DevTools to locate memory retention paths and slow execution trees.

### 3. Implementation: Standard vs Optimized

\`\`\`javascript
// BRUTE FORCE: Accidentally leaking memory
const cache = {};
app.get('/data', (req, res) => {
  // Unbounded cache grows infinitely
  cache[Date.now()] = new Array(1000000).fill('data');
  res.send('ok');
});
\`\`\`

\`\`\`javascript
// OPTIMIZED: Bounded caching strategy using LRU
const LRU = require('lru-cache');
const options = { max: 500, maxSize: 5000, sizeCalculation: (n) => n.length };
const cache = new LRU(options);

app.get('/data', (req, res) => {
  cache.set(Date.now(), new Array(1000).fill('data'));
  res.send('ok');
});
\`\`\`

### 4. Trade-offs & Complexity
- **Time Complexity:** O(M) GC pause times where M is the number of live objects in the heap.
- **Space Complexity:** Caching uses O(K) space where K is the bound limit, rather than O(infinity) in a leaky app.
- **Trade-offs:** Implementing strict bounds and profiling tooling prevents crashes, but continuous profiling in production can induce a 5-10% CPU overhead.`,
    interviewQuestions: [
      { question: "How do you detect a memory leak in Node.js?", answer: "By monitoring memory consumption over time; if the baseline memory continuously rises without dropping after GC, it's a leak." },
      { question: "What is a Heap Snapshot?", answer: "A serialized state of the V8 engine's memory heap at a specific moment, used to inspect what objects are retaining memory." },
      { question: "How does V8 Garbage Collection work?", answer: "It uses a generational approach with short-lived objects collected quickly via Scavenge, and long-lived objects via Mark-and-Sweep." },
      { question: "What is the danger of closures in long-running applications?", answer: "Closures can unintentionally retain references to large outer-scope variables, preventing them from being garbage collected." },
      { question: "How do you take a heap snapshot programmatically?", answer: "Using the 'v8' module: require('v8').writeHeapSnapshot();" }
    ],
    practicalTask: {
      scenario: "You have an unbounded array causing an Out-Of-Memory crash.",
      task: "Refactor the array storage to use a bounded caching mechanism.",
      solutionCode: "const LRUCache = require('lru-cache'); const cache = new LRUCache({ max: 100 }); cache.set('key', hugeData);"
    }
  }
];

appendTopics('nodejs', 'Node.js Enterprise Backend', 'The definitive guide.', topics);
