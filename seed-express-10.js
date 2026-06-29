import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "express-advanced-microservices",
    title: "46. Advanced Microservices in Express",
    order: 46,
    content: "### 1. Conceptual Overview\nMicroservices architecture in Express involves breaking down a monolithic application into smaller, independent services that communicate over a network.\n\n### 2. Architecture & Mechanics\nEach Express service has its own database and is deployed independently. Communication usually happens via REST, gRPC, or message brokers like RabbitMQ.\n\n### 3. Implementation: Standard vs Optimized\nStandard: Synchronous HTTP calls between Express services. Optimized: Event-driven communication using Kafka to decouple services.\n\n### 4. Trade-offs & Complexity\nMicroservices increase system resilience but add immense operational complexity, requiring robust CI/CD, service discovery, and tracing.",
    interviewQuestions: [
      { question: "What are the benefits of using Express for microservices?", answer: "Express is lightweight and fast, making it ideal for small, focused services." },
      { question: "How do Express microservices communicate?", answer: "Via HTTP REST APIs, gRPC, or messaging queues." },
      { question: "What is the API Gateway pattern?", answer: "An API Gateway acts as a single entry point, routing requests to appropriate Express microservices." },
      { question: "How to handle data consistency in microservices?", answer: "Using patterns like Saga or eventual consistency, since distributed transactions are hard." },
      { question: "Why avoid synchronous HTTP calls between microservices?", answer: "They create tight coupling and reduce overall system availability if one service fails." }
    ],
    practicalTask: {
      scenario: "Implementing an API Gateway.",
      task: "Create a simple Express API gateway that proxies requests to another service.",
      solutionCode: "const express = require('express');\nconst { createProxyMiddleware } = require('http-proxy-middleware');\nconst app = express();\napp.use('/users', createProxyMiddleware({ target: 'http://users-service:3001', changeOrigin: true }));\napp.listen(3000);"
    }
  },
  {
    slug: "distributed-tracing-logging",
    title: "47. Distributed Tracing and Logging",
    order: 47,
    content: "### 1. Conceptual Overview\nIn distributed Express applications, tracking a single user request across multiple services requires distributed tracing.\n\n### 2. Architecture & Mechanics\nA unique trace ID is generated at the entry point and passed in HTTP headers to downstream services. Logs are aggregated centrally.\n\n### 3. Implementation: Standard vs Optimized\nStandard: Console.log without context. Optimized: Winston/Pino with OpenTelemetry integration for distributed tracing.\n\n### 4. Trade-offs & Complexity\nImplementing tracing requires instrumentation overhead and infrastructure like Jaeger or Zipkin, but it's essential for debugging.",
    interviewQuestions: [
      { question: "What is distributed tracing?", answer: "It's a method used to profile and monitor applications, especially those built using a microservices architecture." },
      { question: "What role does a Correlation ID play?", answer: "It uniquely identifies a single request chain across multiple services for easier debugging." },
      { question: "Why use Pino over Winston in Express?", answer: "Pino is generally faster and has lower overhead due to its asynchronous logging approach." },
      { question: "What is OpenTelemetry?", answer: "An open-source observability framework for generating, capturing, and exporting telemetry data." },
      { question: "How do you pass trace IDs between Express services?", answer: "By extracting the trace ID from incoming request headers and injecting it into outgoing HTTP request headers." }
    ],
    practicalTask: {
      scenario: "Adding correlation IDs.",
      task: "Create a middleware that adds a correlation ID to every request if not present.",
      solutionCode: "const { v4: uuidv4 } = require('uuid');\napp.use((req, res, next) => {\n  req.correlationId = req.headers['x-correlation-id'] || uuidv4();\n  res.setHeader('x-correlation-id', req.correlationId);\n  next();\n});"
    }
  },
  {
    slug: "memory-leak-detection",
    title: "48. Memory Leak Detection and Profiling",
    order: 48,
    content: "### 1. Conceptual Overview\nMemory leaks occur when an Express app retains references to objects that are no longer needed, preventing garbage collection.\n\n### 2. Architecture & Mechanics\nV8 engine's garbage collector cleans up memory. Leaks happen in global variables, closures, or unhandled event listeners.\n\n### 3. Implementation: Standard vs Optimized\nStandard: Restarting the app when memory is high. Optimized: Using Node.js inspector and heap snapshots to find and fix the root cause.\n\n### 4. Trade-offs & Complexity\nProfiling in production can cause performance degradation. Heap snapshots are large and require careful analysis.",
    interviewQuestions: [
      { question: "What causes memory leaks in Express apps?", answer: "Global variables, uncleared intervals, event listener accumulation, and closures holding onto large objects." },
      { question: "How do you take a heap snapshot in Node.js?", answer: "Using the 'v8' module's writeHeapSnapshot function or via the Node inspector." },
      { question: "What is the role of the garbage collector?", answer: "To automatically reclaim memory occupied by objects that are no longer referenced." },
      { question: "Why are closures a common source of leaks?", answer: "Because they can inadvertently keep references to outer scope variables long after the outer function has finished executing." },
      { question: "How to monitor memory usage in an Express app?", answer: "Using process.memoryUsage() or external APM tools like New Relic or Datadog." }
    ],
    practicalTask: {
      scenario: "Monitoring memory usage.",
      task: "Create an endpoint that returns the current memory usage of the Node process.",
      solutionCode: "app.get('/memory', (req, res) => {\n  const memory = process.memoryUsage();\n  res.json({ rss: memory.rss, heapTotal: memory.heapTotal, heapUsed: memory.heapUsed });\n});"
    }
  },
  {
    slug: "zero-downtime-deployments",
    title: "49. Zero-Downtime Deployments with Express",
    order: 49,
    content: "### 1. Conceptual Overview\nZero-downtime deployment ensures that an Express application remains available to users while being updated to a new version.\n\n### 2. Architecture & Mechanics\nTechniques like Blue/Green deployments or Rolling updates are used. A load balancer routes traffic to the old version until the new version is ready.\n\n### 3. Implementation: Standard vs Optimized\nStandard: Stop app, pull code, start app (downtime). Optimized: PM2 cluster mode with reload, or Kubernetes rolling updates.\n\n### 4. Trade-offs & Complexity\nRequires careful database schema migration handling and backward compatibility, complicating the deployment pipeline.",
    interviewQuestions: [
      { question: "What is a zero-downtime deployment?", answer: "A deployment strategy where the application remains fully available during the update process." },
      { question: "How does PM2 achieve zero-downtime reloads?", answer: "By spawning new worker processes, waiting for them to be ready, and then gracefully shutting down the old ones." },
      { question: "What is a Blue/Green deployment?", answer: "Running two identical production environments; traffic is switched from the old (Blue) to the new (Green) after testing." },
      { question: "How to handle database migrations in zero-downtime?", answer: "Migrations must be backward compatible, often requiring multi-step deployments (add column, deploy, populate, drop old column)." },
      { question: "Why is graceful shutdown important?", answer: "To ensure existing requests finish processing and resources are properly released before the process exits." }
    ],
    practicalTask: {
      scenario: "Implementing graceful shutdown.",
      task: "Write code to gracefully shut down an Express server on SIGINT.",
      solutionCode: "const server = app.listen(3000);\nprocess.on('SIGINT', () => {\n  server.close(() => {\n    console.log('Server gracefully closed');\n    process.exit(0);\n  });\n});"
    }
  },
  {
    slug: "high-performance-cpp-addons",
    title: "50. High-Performance Express with C++ Addons",
    order: 50,
    content: "### 1. Conceptual Overview\nFor CPU-intensive tasks, Node.js can offload work to native C++ addons, bypassing the limitations of JavaScript's single thread.\n\n### 2. Architecture & Mechanics\nNode-API (N-API) provides a stable ABI to build native addons. The C++ code executes synchronously or asynchronously via libuv worker threads.\n\n### 3. Implementation: Standard vs Optimized\nStandard: Doing heavy math in a pure JS Express route. Optimized: Delegating the heavy math to a C++ addon or worker thread.\n\n### 4. Trade-offs & Complexity\nNative addons introduce platform dependency, complex build systems (node-gyp), and harder debugging compared to pure JavaScript.",
    interviewQuestions: [
      { question: "Why use C++ addons in Node.js?", answer: "To perform CPU-intensive operations that would otherwise block the Event Loop in pure JavaScript." },
      { question: "What is N-API?", answer: "An API for building native addons that is independent of the underlying JavaScript engine (V8) and stable across Node.js versions." },
      { question: "How does an async C++ addon work?", answer: "It uses libuv worker threads to run the C++ code in the background and calls a JavaScript callback when finished." },
      { question: "What is node-gyp?", answer: "A cross-platform command-line tool written in Node.js for compiling native addon modules for Node.js." },
      { question: "What is an alternative to C++ addons for CPU tasks?", answer: "Node.js Worker Threads can be used to run JavaScript in parallel without the complexity of C++." }
    ],
    practicalTask: {
      scenario: "Offloading CPU work.",
      task: "Simulate offloading work by using a worker thread in an Express route instead of a C++ addon.",
      solutionCode: "const { Worker } = require('worker_threads');\napp.get('/heavy', (req, res) => {\n  const worker = new Worker('./heavy-task.js');\n  worker.on('message', result => res.send(result));\n});"
    }
  }
];

appendTopics("express", "Express.js Masterclass", "Advanced Express.js concepts", topics).then(() => console.log('Seed Express 10 executed!'));
