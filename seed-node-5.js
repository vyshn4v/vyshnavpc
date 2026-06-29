import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "node-cluster-pm2",
    title: "21. Advanced Cluster Module & PM2",
    order: 21,
    content: `### 1. Conceptual Overview
Node.js runs in a single-threaded process by default. To utilize multi-core systems efficiently, we need to launch a cluster of Node.js processes. The Cluster module allows easy creation of child processes that share server ports. PM2 is an industry-standard process manager that wraps clustering with advanced features like zero-downtime reloads and logging.

### 2. Architecture & Mechanics
When using the cluster module, a single "master" (primary) process routes incoming connections to multiple "worker" processes using an OS-level load balancing algorithm (like Round-Robin). Workers execute the actual application code, and if a worker crashes, the master can detect it and spawn a replacement without dropping the main server connection.

### 3. Implementation: Standard vs Optimized
Standard implementation requires manual setup using the built-in \`cluster\` module:
\`\`\`javascript
import cluster from 'cluster';
import os from 'os';
import http from 'http';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) cluster.fork();
  cluster.on('exit', () => cluster.fork());
} else {
  http.createServer((req, res) => res.end('Hello')).listen(8000);
}
\`\`\`
Optimized implementation delegates clustering to PM2, allowing simple deployment without altering application code:
\`\`\`bash
pm2 start app.js -i max
\`\`\`

### 4. Trade-offs & Complexity
Clustering vastly increases throughput on multi-core machines, but it introduces complexity in state management. In-memory sessions or caches will not be shared across workers, requiring an external store like Redis. Debugging can also be harder when requests are distributed unpredictably across workers.`,
    interviewQuestions: [
      { question: "How does the Node.js cluster module handle incoming requests?", answer: "The master process listens on the port and distributes incoming connections to worker processes using a Round-Robin approach." },
      { question: "Why avoid storing session data in memory when using clustering?", answer: "Because each worker process runs in its own isolated memory space. A request might go to Worker A, while the next goes to Worker B, leading to lost session context unless an external store like Redis is used." },
      { question: "What is the difference between cluster and worker_threads?", answer: "Cluster creates entirely new Node.js processes with separate memory and V8 instances. worker_threads run within a single process and can share memory." },
      { question: "How does PM2 achieve zero-downtime reloads?", answer: "It spawns new worker processes with the updated code before gracefully shutting down the old worker processes, ensuring no requests are dropped during the transition." },
      { question: "What happens if a worker process dies in a cluster?", answer: "The worker process emits an 'exit' event to the primary process. A robust cluster implementation should listen to this event and call cluster.fork() to spawn a replacement." }
    ],
    practicalTask: {
      scenario: "Setting up a resilient multi-core HTTP server.",
      task: "Write a script utilizing the cluster module to spawn workers for each CPU core, restarting them if they crash.",
      solutionCode: "import cluster from 'cluster';\nimport os from 'os';\nimport http from 'http';\nif(cluster.isPrimary){\n  os.cpus().forEach(() => cluster.fork());\n  cluster.on('exit', () => cluster.fork());\n} else {\n  http.createServer((q,s) => s.end('OK')).listen(3000);\n}"
    }
  },
  {
    slug: "node-performance-profiling",
    title: "22. Performance Profiling & Memory Leaks",
    order: 22,
    content: `### 1. Conceptual Overview
Performance profiling involves analyzing a Node.js application to find CPU bottlenecks and memory leaks. A memory leak occurs when objects are no longer needed but remain referenced, preventing the Garbage Collector (GC) from freeing up memory. Over time, leaks cause memory bloat and application crashes (OOM - Out of Memory).

### 2. Architecture & Mechanics
Node.js uses the V8 engine, which manages memory with a generational Garbage Collector. Short-lived objects are cleared quickly in the "new space", while long-lived objects are moved to the "old space". Profiling tools like the V8 inspector, Chrome DevTools, and \`--inspect\` flags allow developers to take heap snapshots and record CPU profiles to analyze execution time and memory usage.

### 3. Implementation: Standard vs Optimized
A standard approach is periodically logging \`process.memoryUsage()\`:
\`\`\`javascript
setInterval(() => {
  console.log(process.memoryUsage().heapUsed / 1024 / 1024 + ' MB');
}, 10000);
\`\`\`
Optimized profiling uses the built-in inspector or clinic.js to generate flamegraphs and analyze memory:
\`\`\`bash
node --inspect app.js
# Then open Chrome and navigate to chrome://inspect to take a heap snapshot.
\`\`\`

### 4. Trade-offs & Complexity
Taking heap snapshots pauses the main thread, making it unsuitable for live production environments during peak loads. Profiling adds computational overhead, so continuous profiling in production usually relies on specialized lightweight APM tools (e.g., Datadog, New Relic) rather than raw V8 inspection.`,
    interviewQuestions: [
      { question: "What is a memory leak in Node.js?", answer: "It occurs when references to objects are kept unintentionally, preventing the Garbage Collector from releasing the allocated memory, eventually causing an Out of Memory crash." },
      { question: "How can closures cause memory leaks?", answer: "If a closure captures variables and the closure itself is stored in a long-lived object (like a global array or event listener), the captured variables cannot be garbage collected." },
      { question: "What is a heap snapshot?", answer: "A point-in-time record of all objects in the V8 heap and their references. Comparing two heap snapshots helps identify objects that are growing in number over time." },
      { question: "How does the V8 Garbage Collector work?", answer: "It uses a generational approach, dividing memory into new space and old space. It uses a mark-and-sweep algorithm to identify unreachable objects and free their memory." },
      { question: "What does the node --inspect flag do?", answer: "It starts the Node.js process with the V8 inspector enabled, allowing debugging and profiling via Chrome DevTools or other compatible debuggers." }
    ],
    practicalTask: {
      scenario: "Diagnosing a memory bloat issue.",
      task: "Create a route that intentionally leaks memory by pushing data into a global array, and monitor the heap usage.",
      solutionCode: "import http from 'http';\nconst leak = [];\nhttp.createServer((req, res) => {\n  leak.push(new Array(1e5).fill('leak'));\n  res.end(String(process.memoryUsage().heapUsed));\n}).listen(3000);"
    }
  },
  {
    slug: "node-cpp-addons-napi",
    title: "23. C++ Addons & N-API",
    order: 23,
    content: `### 1. Conceptual Overview
Sometimes JavaScript is not fast enough for heavy computational tasks like image processing or complex cryptography. Node.js allows developers to write C++ Addons—dynamically linked shared objects that can be loaded into Node.js using \`require()\`. N-API (Node-API) is the modern, stable C API for building these native addons.

### 2. Architecture & Mechanics
N-API provides an abstraction layer over the underlying V8 JavaScript engine. This means an addon compiled with N-API will work across different versions of Node.js without needing to be recompiled, unlike the older \`nan\` (Native Abstractions for Node.js) approach. The C++ code is compiled into a \`.node\` file using \`node-gyp\`.

### 3. Implementation: Standard vs Optimized
Writing a standard addon using raw V8 APIs binds the code to a specific Node.js version.
Optimized implementation uses \`node-addon-api\` (the C++ wrapper for N-API):
\`\`\`cpp
#include <napi.h>

Napi::String Hello(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "Hello World from C++");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("hello", Napi::Function::New(env, Hello));
  return exports;
}
NODE_API_MODULE(addon, Init)
\`\`\`

### 4. Trade-offs & Complexity
Writing C++ addons introduces immense complexity: manual memory management, compilation steps across different operating systems (Windows vs Linux vs macOS), and harder debugging. However, it provides absolute maximum performance and allows integrating existing C/C++ libraries directly into Node.js applications.`,
    interviewQuestions: [
      { question: "What is the primary purpose of N-API in Node.js?", answer: "To provide a stable Application Binary Interface (ABI) for building native C++ addons that don't need recompilation across different Node.js versions." },
      { question: "What tool is commonly used to compile Node.js C++ addons?", answer: "node-gyp is the standard tool used to compile native C++ addons into .node binary files." },
      { question: "Why might you write a C++ addon instead of using Worker Threads?", answer: "When you need maximum computational performance, hardware-level access, or need to wrap an existing legacy C/C++ library for use in JavaScript." },
      { question: "Does a C++ addon block the Node.js event loop?", answer: "Yes, if the C++ code is executed synchronously. To avoid blocking, the addon must use asynchronous execution via N-API's async workers." },
      { question: "What is the file extension of a compiled native addon?", answer: "Compiled addons have a .node extension and can be loaded directly using require() or process.dlopen()." }
    ],
    practicalTask: {
      scenario: "Setting up a build configuration for a native addon.",
      task: "Write a minimal binding.gyp file configuration to compile an addon named 'hello'.",
      solutionCode: "{\n  \"targets\": [\n    {\n      \"target_name\": \"hello\",\n      \"sources\": [ \"hello.cc\" ]\n    }\n  ]\n}"
    }
  },
  {
    slug: "node-secure-coding",
    title: "24. Secure Coding Practices in Node.js",
    order: 24,
    content: `### 1. Conceptual Overview
Securing a Node.js application involves defending against common web vulnerabilities like Injection, Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), and securing the underlying JavaScript runtime. The single-threaded nature of Node.js makes it specifically vulnerable to ReDoS (Regular Expression Denial of Service).

### 2. Architecture & Mechanics
Security is implemented in layers. At the application level, input validation and ORM/Query builders prevent SQL/NoSQL injections. Security headers (via libraries like Helmet) mitigate XSS and clickjacking. At the runtime level, avoiding \`eval()\`, carefully managing dependencies (npm audit), and avoiding catastrophic backtracking in regex protect the server's availability.

### 3. Implementation: Standard vs Optimized
Standard implementation might manually set some headers:
\`\`\`javascript
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
\`\`\`
Optimized implementation utilizes robust, battle-tested middleware and limits payloads:
\`\`\`javascript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
\`\`\`

### 4. Trade-offs & Complexity
Strict security measures, like strong Content Security Policy (CSP), can break legitimate application functionality or inline scripts if not configured carefully. Rate limiting and payload size limits might block valid power users. Security is a constant balance between usability, performance, and risk mitigation.`,
    interviewQuestions: [
      { question: "What is ReDoS and why is Node.js particularly vulnerable?", answer: "Regular Expression Denial of Service. Because Node.js is single-threaded, a poorly optimized regex processing a malicious string can block the event loop entirely." },
      { question: "How can you prevent NoSQL injection in MongoDB with Node.js?", answer: "By using an ODM like Mongoose which casts data types, or by strictly sanitizing user input and rejecting objects containing operators like $where or $ne." },
      { question: "What is the purpose of the Helmet middleware?", answer: "Helmet helps secure Express apps by setting various HTTP headers like Strict-Transport-Security, X-Frame-Options, and Content-Security-Policy." },
      { question: "Why is using eval() dangerous in Node.js?", answer: "eval() executes arbitrary strings as JavaScript. If user input is passed to eval(), an attacker can execute arbitrary code on the server, compromising the entire system." },
      { question: "How do you protect against large payload attacks?", answer: "By limiting the size of the incoming request body using middleware options, like express.json({ limit: '10kb' }), to prevent memory exhaustion." }
    ],
    practicalTask: {
      scenario: "Hardening an Express application.",
      task: "Apply Helmet and a 10kb JSON body limit to an Express app.",
      solutionCode: "import express from 'express';\nimport helmet from 'helmet';\nconst app = express();\napp.use(helmet());\napp.use(express.json({ limit: '10kb' }));\napp.listen(3000);"
    }
  },
  {
    slug: "node-microservices-scalable",
    title: "25. Designing Scalable Microservices with Node.js",
    order: 25,
    content: `### 1. Conceptual Overview
As applications grow, monolithic architectures become difficult to maintain and scale. Microservices architecture splits the application into small, independent services communicating over a network. Node.js is exceptionally suited for microservices due to its lightweight footprint, fast startup times, and non-blocking I/O.

### 2. Architecture & Mechanics
In a microservices setup, each Node.js service focuses on a specific business domain (e.g., Auth Service, Payment Service). They communicate via synchronous REST/gRPC or asynchronous message brokers like RabbitMQ or Apache Kafka. An API Gateway sits in front to route requests, handle authentication, and aggregate responses.

### 3. Implementation: Standard vs Optimized
A standard approach uses synchronous HTTP calls between services:
\`\`\`javascript
// Service A calling Service B
const response = await fetch('http://service-b/api/data');
const data = await response.json();
\`\`\`
An optimized approach uses event-driven communication via a message broker to decouple services and handle high load gracefully:
\`\`\`javascript
import amqp from 'amqplib';

const conn = await amqp.connect('amqp://localhost');
const channel = await conn.createChannel();
await channel.assertQueue('order_queue');
channel.sendToQueue('order_queue', Buffer.from(JSON.stringify({ id: 1 })));
\`\`\`

### 4. Trade-offs & Complexity
Microservices provide excellent horizontal scaling and team autonomy but introduce significant operational complexity. Distributed tracing, centralized logging, and deployment orchestration (e.g., Kubernetes) become mandatory. Network latency between services increases overall response times compared to in-memory function calls within a monolith.`,
    interviewQuestions: [
      { question: "Why is Node.js well-suited for a microservices architecture?", answer: "Its fast startup time, low memory footprint, and non-blocking I/O model make it ideal for building lightweight, scalable services that primarily handle network requests." },
      { question: "What is the role of an API Gateway in microservices?", answer: "It acts as a single entry point for clients, routing requests to appropriate microservices, handling cross-cutting concerns like SSL termination, authentication, and rate limiting." },
      { question: "What is the difference between synchronous and asynchronous microservice communication?", answer: "Synchronous (REST, gRPC) requires the receiving service to be available immediately. Asynchronous (RabbitMQ, Kafka) uses a queue, decoupling services and allowing message processing at varying rates." },
      { question: "How do you handle distributed transactions across multiple microservices?", answer: "Using patterns like the Saga pattern, where a transaction is broken into local transactions with compensation logic (rollbacks) if a subsequent step fails." },
      { question: "What is distributed tracing?", answer: "A method to track a request's journey across multiple microservices, usually implemented by passing a unique Correlation ID in the headers to diagnose latency and errors." }
    ],
    practicalTask: {
      scenario: "Connecting to a message broker.",
      task: "Write a script to connect to an AMQP broker and assert a queue named 'tasks'.",
      solutionCode: "import amqp from 'amqplib';\nasync function setup() {\n  const conn = await amqp.connect('amqp://localhost');\n  const ch = await conn.createChannel();\n  await ch.assertQueue('tasks');\n}\nsetup();"
    }
  }
];

appendTopics('nodejs', 'Node.js Masterclass', 'Mastering the event loop, streams, clusters, and advanced system architecture.', topics);
