import { insertRound } from './insertRound.js';

const roundData = {
  roundId: 'round-3',
  roundName: 'Round 3: Backend & APIs',
  order: 3,
  description: 'Deep dive into Backend architecture, Node.js, Express, Strapi CMS, tailored to experience with building 15+ RESTful APIs, policy lifecycle automation, and handling heavy loads.',
  categories: [
    {
      categoryName: 'Node.js Core & Event Loop',
      questions: [
        {
          difficulty: 'Medium',
          question: 'Can you explain the Node.js Event Loop and how it allows Node.js to handle asynchronous operations despite being single-threaded?',
          expectedAnswer: 'The Event Loop enables non-blocking I/O by offloading operations to the system kernel (via libuv). It processes phases like timers, pending callbacks, poll, check (setImmediate), and close callbacks. The microtask queue (process.nextTick, Promises) runs between phases.',
          redFlags: ['Believes Node.js creates a new thread for every request', 'Confuses synchronous and asynchronous code execution paths'],
          bonusPoints: ['Explains the role of libuv', 'Distinguishes between process.nextTick() and Promises in the microtask queue']
        },
        {
          difficulty: 'Hard',
          question: 'In your experience handling heavy loads, how do you prevent the Node.js Event Loop from being blocked by CPU-intensive tasks?',
          expectedAnswer: 'CPU-intensive tasks block the main thread. To prevent this, we can offload work to Worker Threads (using the worker_threads module), use child processes for separate execution, or offload heavy processing to external services/message queues like RabbitMQ (as done in the Domain Scanner project).',
          redFlags: ['Suggests using setTimeout to fix heavy CPU tasks without understanding it just delays the block', 'Unaware of Worker Threads'],
          bonusPoints: ['Mentions clustering or PM2 for utilizing multiple CPU cores', 'Shares practical examples from the Domain Scanner project using RabbitMQ']
        },
        {
          difficulty: 'Medium',
          question: 'Explain the difference between `setTimeout(..., 0)` and `setImmediate()` in Node.js.',
          expectedAnswer: '`setTimeout(..., 0)` schedules a callback to run after the timers phase, while `setImmediate()` schedules a callback to run in the check phase, immediately after the poll phase completes. If called within an I/O cycle, `setImmediate` always executes first.',
          redFlags: ['Cannot differentiate the two', 'Thinks they are perfectly identical'],
          bonusPoints: ['Knows that execution order is non-deterministic if called from the main module outside an I/O cycle']
        },
        {
          difficulty: 'Hard',
          question: 'How do you handle memory leaks in a long-running Node.js application, especially when processing complex workflows like policy lifecycle automation?',
          expectedAnswer: 'Identify memory leaks using tools like Node.js built-in inspector, Chrome DevTools, or PM2. Take heap snapshots and compare them to find retaining objects. Common culprits are global variables, closures holding references, and uncleared event listeners or timers.',
          redFlags: ['Has no strategy for debugging memory leaks', 'Thinks garbage collection automatically solves all memory issues'],
          bonusPoints: ['Mentions using stream processing for large payloads instead of loading everything into memory']
        },
        {
          difficulty: 'Expert',
          question: 'When building APIs for enterprise clients like Sunlife PH, how do you manage streaming large amounts of data to avoid memory exhaustion?',
          expectedAnswer: 'Instead of buffering entire files or large datasets into memory, we use Node.js Streams (Readable, Writable, Transform). We pipe data from the source (e.g., database or file) directly to the response object, keeping memory usage constant regardless of data size.',
          redFlags: ['Suggests increasing Node.js memory limit as the primary solution', 'Does not understand stream piping'],
          bonusPoints: ['Discusses backpressure and how to handle it when the writable stream is slower than the readable stream']
        }
      ]
    },
    {
      categoryName: 'API Design & Security',
      questions: [
        {
          difficulty: 'Medium',
          question: 'You have engineered 15+ RESTful APIs. What are the core principles you follow when designing a scalable and maintainable REST API?',
          expectedAnswer: 'Use standard HTTP methods (GET, POST, PUT, DELETE) appropriately. Design resource-oriented URLs using nouns, not verbs. Use proper HTTP status codes. Implement pagination, filtering, and sorting for collections. Version the APIs (e.g., /v1/users).',
          redFlags: ['Uses verbs in URLs (e.g., /getUser)', 'Always returns HTTP 200 even for errors'],
          bonusPoints: ['Mentions HATEOAS', 'Discusses idempotency, especially for PUT and DELETE methods']
        },
        {
          difficulty: 'Hard',
          question: 'For your dynamic, stage-based decision API managing complex state logic, how did you ensure role-specific, context-aware authorization?',
          expectedAnswer: 'Implement Role-Based Access Control (RBAC) or Attribute-Based Access Control (ABAC). Use middleware to verify JWT tokens and check user roles/permissions against the requested resource and its current state before allowing the action.',
          redFlags: ['Relies solely on frontend hiding elements for security', 'Hardcodes roles inside the route handlers instead of reusable middleware'],
          bonusPoints: ['Discusses policy definitions and separating authorization logic from business logic', 'Mentions using Strapi CMS built-in RBAC features']
        },
        {
          difficulty: 'Medium',
          question: 'What strategies do you use to secure an Express.js application against common web vulnerabilities (e.g., XSS, CSRF, SQL/NoSQL Injection)?',
          expectedAnswer: 'Use libraries like `helmet` to set secure HTTP headers. Sanitize and validate all user inputs (e.g., using Joi or express-validator) to prevent injections. Use CORS to restrict cross-origin requests. For CSRF, use anti-CSRF tokens if using session cookies, or rely on stateless JWTs stored securely.',
          redFlags: ['Does not validate input', 'Unfamiliar with OWASP Top 10'],
          bonusPoints: ['Mentions rate limiting to prevent brute force/DDoS', 'Discusses storing JWTs in HttpOnly secure cookies instead of localStorage']
        },
        {
          difficulty: 'Hard',
          question: 'How do you handle API versioning when breaking changes are necessary for enterprise clients, ensuring backward compatibility?',
          expectedAnswer: 'Route-based versioning (e.g., /api/v1/... and /api/v2/...). Alternatively, header-based versioning (Accept header). Maintain the older version for an agreed deprecation period while clients migrate, and monitor usage logs to safely retire the old version.',
          redFlags: ['Overwrites existing endpoints causing client breakage', 'Has no deprecation strategy'],
          bonusPoints: ['Discusses API Gateways for managing versions and routing']
        },
        {
          difficulty: 'Expert',
          question: 'When using Strapi CMS for enterprise clients, how do you customize controllers and services while maintaining upgradability?',
          expectedAnswer: 'Strapi allows overriding core controllers and services in the `src/api/[content-type]` directory. Instead of modifying core node_modules, you extend or replace the default behaviors by creating custom lifecycle hooks, services, and controllers in the project codebase.',
          redFlags: ['Modifies files directly in node_modules', 'Unaware of Strapi lifecycle hooks'],
          bonusPoints: ['Discusses optimizing Strapi database queries using the Entity Service API or Query Engine API']
        }
      ]
    },
    {
      categoryName: 'Asynchronous Workflows',
      questions: [
        {
          difficulty: 'Medium',
          question: 'You utilized RabbitMQ for asynchronous task processing in the Domain Scanner project. Why choose a message queue over simple asynchronous Node.js execution?',
          expectedAnswer: 'Message queues provide durability, decoupling, and scalability. Simple async execution in Node is lost if the server crashes. RabbitMQ ensures tasks (like domain analysis) are queued, distributed among workers, and acknowledged only on success, enabling retry logic and preventing main thread blocking.',
          redFlags: ['Thinks Promises are a substitute for a message queue for long-running, resilient tasks'],
          bonusPoints: ['Discusses exchange types in RabbitMQ (fanout, direct, topic)', 'Explains dead-letter queues for failed messages']
        },
        {
          difficulty: 'Hard',
          question: 'How did you implement automated retry logic for scan failures in the Domain Scanner project?',
          expectedAnswer: 'Using message queues (like RabbitMQ) with delayed exchanges or dead-letter queues to re-queue failed messages. Alternatively, tracking attempt counts in PostgreSQL/Redis and using a cron/worker to retry failed states with exponential backoff.',
          redFlags: ['Uses simple while-loops or recursive setTimeout without persistent state', 'No exponential backoff strategy'],
          bonusPoints: ['Discusses exponential backoff and jitter to prevent thundering herd problems']
        },
        {
          difficulty: 'Hard',
          question: 'In automating policy lifecycle workflows, how do you handle distributed transactions where multiple services or databases need to be updated consistently?',
          expectedAnswer: 'Since NoSQL/Microservices don’t support ACID transactions across services natively, we use patterns like the Saga pattern (choreography or orchestration) where each step has a compensating transaction to undo the work if a subsequent step fails, ensuring eventual consistency.',
          redFlags: ['Assumes distributed databases have out-of-the-box ACID guarantees', 'Ignores partial failure scenarios'],
          bonusPoints: ['Discusses Two-Phase Commit (2PC) and why it might be too slow for modern microservices compared to Sagas']
        },
        {
          difficulty: 'Medium',
          question: 'What is the difference between `Promise.all()` and `Promise.allSettled()`, and when would you use each in an API endpoint?',
          expectedAnswer: '`Promise.all()` rejects immediately if any of the promises reject, useful when all operations must succeed. `Promise.allSettled()` waits for all promises to resolve or reject and returns an array of their results, useful when operations are independent and partial success is acceptable.',
          redFlags: ['Does not know `Promise.allSettled()` exists'],
          bonusPoints: ['Mentions `Promise.race()` and `Promise.any()` with practical use cases']
        },
        {
          difficulty: 'Expert',
          question: 'How do you design APIs that kick off long-running asynchronous jobs (e.g., complex insurance underwriting) where the client needs to know the result?',
          expectedAnswer: 'Use the Asynchronous Request-Reply pattern. The API accepts the request and immediately returns a 202 Accepted status with a job ID or a polling URL. The client then polls that URL, or the server pushes the result via WebSockets/Server-Sent Events (SSE) or Webhooks when the job completes.',
          redFlags: ['Keeps the HTTP connection open indefinitely until the job finishes (causing timeouts)'],
          bonusPoints: ['Discusses WebSockets/Socket.IO integration for real-time updates as implemented in previous projects']
        }
      ]
    },
    {
      categoryName: 'Error Handling & Debugging',
      questions: [
        {
          difficulty: 'Medium',
          question: 'What is your standard approach for handling errors in an Express.js application?',
          expectedAnswer: 'Use a centralized error-handling middleware at the end of the middleware chain. Catch errors in async routes using try-catch blocks and pass them to the `next(err)` function, or use a wrapper like `express-async-errors`. Standardize the error response format.',
          redFlags: ['Scatters console.logs and res.status(500) everywhere without a centralized handler', 'Leaves unhandled promise rejections'],
          bonusPoints: ['Creates custom Error classes (e.g., ValidationError, NotFoundError) for structured error handling']
        },
        {
          difficulty: 'Hard',
          question: 'How do you handle "Unhandled Promise Rejections" and "Uncaught Exceptions" in a production Node.js environment?',
          expectedAnswer: 'Listen to the `unhandledRejection` and `uncaughtException` events on the `process` object. Log the error details properly (to a file or monitoring service), gracefully shut down the server by closing active connections, and let the process manager (like PM2 or Kubernetes) restart it.',
          redFlags: ['Ignores them', 'Keeps the application running after an uncaught exception, leading to an unpredictable state'],
          bonusPoints: ['Mentions graceful shutdown procedures and integrating with PM2 for zero-downtime restarts']
        },
        {
          difficulty: 'Hard',
          question: 'You mentioned resolving critical production issues and optimizing API logic. Can you walk me through your debugging process for an API that is suddenly experiencing high latency?',
          expectedAnswer: 'Check monitoring/APM tools (like New Relic or Datadog) to isolate the bottleneck. Review server logs for errors. Check database query performance and slow logs. Analyze if the event loop is blocked. Use Redis to cache heavy computations or slow DB queries.',
          redFlags: ['Randomly restarts servers as a first step without investigating', 'Does not know how to isolate database vs application layer latency'],
          bonusPoints: ['Discusses adding tracing IDs to logs to follow requests across microservices']
        },
        {
          difficulty: 'Medium',
          question: 'How do you structure your logging strategy for a production Node.js application to ensure logs are useful and searchable?',
          expectedAnswer: 'Use a robust logging library like Winston or Pino. Log in JSON format so it can be easily ingested and parsed by log aggregators (ELK stack, Datadog). Include contextual data like timestamps, request IDs, user IDs, and log levels (info, warn, error).',
          redFlags: ['Relies solely on `console.log`', 'Logs sensitive user data (PII) in plain text'],
          bonusPoints: ['Discusses correlation IDs for tracing requests across distributed systems']
        },
        {
          difficulty: 'Expert',
          question: 'When deploying with Docker and PM2 as you did in the Domain Scanner project, how do you handle log rotation and application state during deployments?',
          expectedAnswer: 'In Docker, logs should stream to stdout/stderr and be handled by the container runtime/logging driver (e.g., fluentd). PM2 manages application state inside the container, but statelessness is key. Use PM2 cluster mode for zero-downtime reloads within a container, or rely on Kubernetes rolling updates.',
          redFlags: ['Stores logs directly in the container filesystem without rotation, eventually crashing the disk'],
          bonusPoints: ['Discusses the pros and cons of using PM2 inside a Docker container versus relying solely on Kubernetes replication']
        }
      ]
    }
  ]
};

insertRound(roundData)
  .then(() => {
    console.log("Successfully seeded round 3");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding round 3:", err);
    process.exit(1);
  });
