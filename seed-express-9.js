import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "express-ch41-advanced-routing-patterns",
    title: "Chapter 41: Advanced Routing Patterns",
    order: 41,
    content: "### 1. Conceptual Overview\nExplore advanced and dynamic routing techniques in Express.\n### 2. Architecture & Mechanics\nHow Express matches routes using path-to-regexp and handles overlapping route definitions.\n### 3. Implementation: Standard vs Optimized\nStandard inline routing vs modular router architecture with dynamic loading.\n### 4. Trade-offs & Complexity\nModular routing increases file count but significantly improves maintainability and separation of concerns.",
    interviewQuestions: [
      { question: "How does Express handle route matching under the hood?", answer: "Express uses the `path-to-regexp` module to parse route strings into regular expressions for matching." },
      { question: "What is the purpose of `express.Router()`?", answer: "It creates a modular, mountable route handler, often referred to as a 'mini-app'." },
      { question: "How can you implement route parameters?", answer: "By using a colon prefix in the route path, like `/users/:id`, and accessing it via `req.params.id`." },
      { question: "What happens if two routes match the same request?", answer: "Express will execute the first matching route handler defined in the code, based on registration order." },
      { question: "How do you handle 404 errors for unmatched routes?", answer: "By defining a catch-all middleware function at the end of the routing pipeline, after all other routes." }
    ],
    practicalTask: {
      scenario: "Modular Router Setup",
      task: "Create a modular router for an API endpoint that handles GET and POST requests.",
      solutionCode: "const express = require('express');\nconst router = express.Router();\nrouter.route('/')\n  .get((req, res) => res.send('List items'))\n  .post((req, res) => res.send('Create item'));\nmodule.exports = router;"
    }
  },
  {
    slug: "express-ch42-security-best-practices",
    title: "Chapter 42: Security Best Practices",
    order: 42,
    content: "### 1. Conceptual Overview\nSecuring Express applications against common web vulnerabilities.\n### 2. Architecture & Mechanics\nUnderstanding the middleware pipeline's role in intercepting and sanitizing requests before they reach core logic.\n### 3. Implementation: Standard vs Optimized\nBasic header setting vs using comprehensive security middleware like Helmet.\n### 4. Trade-offs & Complexity\nSecurity measures can add overhead and complexity to deployment but are critical for production systems.",
    interviewQuestions: [
      { question: "What is Helmet and why is it used?", answer: "Helmet is a collection of middleware functions that set secure HTTP headers to protect against common web vulnerabilities." },
      { question: "How can you prevent Cross-Site Scripting (XSS) in Express?", answer: "By sanitizing user input and using middleware like `helmet.xssFilter`." },
      { question: "What is CSRF and how do you protect against it?", answer: "Cross-Site Request Forgery is mitigated by using anti-CSRF tokens, such as those provided by the `csurf` middleware." },
      { question: "How do you secure cookies in Express?", answer: "By setting the `secure`, `httpOnly`, and `sameSite` flags when configuring cookie sessions." },
      { question: "What is rate limiting and why is it important?", answer: "Limiting the number of requests a client can make within a timeframe, preventing brute-force attacks and DoS." }
    ],
    practicalTask: {
      scenario: "Implementing Security Middleware",
      task: "Integrate Helmet into an Express application.",
      solutionCode: "const express = require('express');\nconst helmet = require('helmet');\nconst app = express();\napp.use(helmet());\n// App routes go here"
    }
  },
  {
    slug: "express-ch43-performance-optimization",
    title: "Chapter 43: Performance Optimization",
    order: 43,
    content: "### 1. Conceptual Overview\nTechniques to maximize throughput and minimize latency in Express applications.\n### 2. Architecture & Mechanics\nThe Node.js event loop and how non-blocking I/O interacts with Express middleware.\n### 3. Implementation: Standard vs Optimized\nSynchronous operations blocking the event loop vs asynchronous, non-blocking patterns and clustering.\n### 4. Trade-offs & Complexity\nAdvanced optimizations like clustering add architectural complexity but scale better across multiple CPU cores.",
    interviewQuestions: [
      { question: "How does gzip compression improve performance?", answer: "It reduces the size of the response body, decreasing network transfer time, achievable using the `compression` middleware." },
      { question: "What is clustering in Node.js?", answer: "A technique to spawn multiple Node.js processes to share the load across multiple CPU cores." },
      { question: "Why should you avoid synchronous functions in Express?", answer: "Because Node.js is single-threaded, synchronous functions block the event loop, preventing other requests from being processed." },
      { question: "How can caching improve an Express app's performance?", answer: "Caching stores frequently accessed data in memory (e.g., Redis), reducing database queries and response times." },
      { question: "What is the role of a reverse proxy like Nginx?", answer: "It handles load balancing, SSL termination, and serving static files, freeing up the Express app to handle dynamic requests." }
    ],
    practicalTask: {
      scenario: "Enabling Compression",
      task: "Add gzip compression to all responses in an Express app.",
      solutionCode: "const express = require('express');\nconst compression = require('compression');\nconst app = express();\napp.use(compression());\n// Routes"
    }
  },
  {
    slug: "express-ch44-advanced-error-handling",
    title: "Chapter 44: Advanced Error Handling",
    order: 44,
    content: "### 1. Conceptual Overview\nBuilding robust error-handling mechanisms for enterprise Express applications.\n### 2. Architecture & Mechanics\nHow Express passes errors down the middleware chain using the `next(err)` pattern.\n### 3. Implementation: Standard vs Optimized\nBasic `console.log` vs centralized error-handling middleware with structured logging and monitoring.\n### 4. Trade-offs & Complexity\nCentralized error handling requires strict conventions across all routes but ensures consistent API responses.",
    interviewQuestions: [
      { question: "How do you define an error-handling middleware in Express?", answer: "By creating a middleware function with exactly four arguments: `(err, req, res, next)`." },
      { question: "How do you handle asynchronous errors in Express routes?", answer: "By wrapping async code in a try/catch block and passing the error to `next()`, or using a library like `express-async-errors`." },
      { question: "What should an error response to a client include?", answer: "A structured JSON object with a generic message and standard HTTP status code, without exposing internal stack traces." },
      { question: "How do you catch unhandled promise rejections globally?", answer: "By listening to the `unhandledRejection` event on the `process` object." },
      { question: "Why is a centralized error handler beneficial?", answer: "It provides a single place to format error responses, log errors, and send alerts, ensuring consistency." }
    ],
    practicalTask: {
      scenario: "Centralized Error Middleware",
      task: "Implement a centralized error-handling middleware that logs the error and sends a generic 500 response.",
      solutionCode: "app.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: 'Internal Server Error' });\n});"
    }
  },
  {
    slug: "express-ch45-testing-strategies",
    title: "Chapter 45: Testing Strategies",
    order: 45,
    content: "### 1. Conceptual Overview\nComprehensive testing methodologies for Express APIs.\n### 2. Architecture & Mechanics\nIsolating routes, mocking dependencies, and simulating HTTP requests for automated testing.\n### 3. Implementation: Standard vs Optimized\nManual Postman testing vs automated integration testing using tools like Supertest and Jest.\n### 4. Trade-offs & Complexity\nWriting robust tests consumes initial development time but significantly reduces regression bugs in production.",
    interviewQuestions: [
      { question: "What is the difference between unit and integration testing in Express?", answer: "Unit tests isolate individual functions or middleware, while integration tests verify the interaction between components, like routes and databases." },
      { question: "What is Supertest commonly used for?", answer: "Supertest is an HTTP assertion library used for testing Express routes by simulating requests and asserting responses." },
      { question: "How do you test an Express app without starting the server?", answer: "By passing the exported Express app instance directly to testing libraries like Supertest." },
      { question: "Why should you mock databases in unit tests?", answer: "To isolate the logic being tested and prevent side effects or dependency on external services." },
      { question: "What is test-driven development (TDD)?", answer: "A methodology where tests are written before the implementation code, driving the design of the application." }
    ],
    practicalTask: {
      scenario: "Testing an Endpoint",
      task: "Write a simple Supertest case to verify a GET /ping endpoint returns a 200 status.",
      solutionCode: "const request = require('supertest');\nconst app = require('../app');\n\ntest('GET /ping should return 200', async () => {\n  const res = await request(app).get('/ping');\n  expect(res.statusCode).toEqual(200);\n});"
    }
  }
];

appendTopics("express", "Express.js Masterclass", "Advanced Express.js concepts and enterprise patterns.", topics);
