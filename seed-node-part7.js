import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "node-performance",
    title: "31. Performance & Profiling",
    order: 31,
    content: "<h2>Identifying Bottlenecks</h2><p>Using built-in Node profilers and external tools to identify memory leaks and CPU hogs.</p>",
    interviewQuestions: [
      { question: "How to generate a CPU profile?", answer: "Run node with the --prof flag, then process the v8.log file." },
      { question: "What is a memory leak in Node.js?", answer: "When references to unused objects are kept alive, preventing the Garbage Collector from freeing memory." }
    ],
    practicalTask: {
      scenario: "Monitor memory usage.",
      task: "Log the current heap usage.",
      solutionCode: "console.log(process.memoryUsage().heapUsed);"
    }
  },
  {
    slug: "node-rate-limiting",
    title: "32. Rate Limiting",
    order: 32,
    content: "<h2>Protecting APIs</h2><p>Preventing abuse and DoS attacks by restricting the number of requests a user can make in a timeframe.</p>",
    interviewQuestions: [
      { question: "Why use Redis for rate limiting?", answer: "It allows sharing rate limit counts across multiple server instances quickly." },
      { question: "What status code is returned for rate limiting?", answer: "429 Too Many Requests." }
    ],
    practicalTask: {
      scenario: "Implement basic rate limiting in Express.",
      task: "Use a middleware package concept.",
      solutionCode: "import rateLimit from 'express-rate-limit';\nconst limiter = rateLimit({ windowMs: 60000, max: 100 });\napp.use(limiter);"
    }
  },
  {
    slug: "node-security-best-practices",
    title: "33. Security Best Practices",
    order: 33,
    content: "<h2>Securing Node.js Applications</h2><p>Using Helmet to set security headers, avoiding eval(), and mitigating SQL/NoSQL injections.</p>",
    interviewQuestions: [
      { question: "What does the Helmet middleware do?", answer: "It secures Express apps by setting various HTTP headers like Content-Security-Policy." },
      { question: "How to prevent NoSQL injection?", answer: "Sanitize user inputs and avoid directly passing raw objects into database queries." }
    ],
    practicalTask: {
      scenario: "Adding Helmet.",
      task: "Import and use Helmet in an Express app.",
      solutionCode: "import helmet from 'helmet';\napp.use(helmet());"
    }
  },
  {
    slug: "node-unit-testing",
    title: "34. Unit Testing (Jest)",
    order: 34,
    content: "<h2>Testing Isolated Code</h2><p>Writing tests to verify individual functions using Jest or Mocha/Chai.</p>",
    interviewQuestions: [
      { question: "What is Jest?", answer: "A popular JavaScript testing framework with built-in assertion, mocking, and coverage tools." },
      { question: "What is test-driven development (TDD)?", answer: "Writing the failing test first, then writing the code to make it pass." }
    ],
    practicalTask: {
      scenario: "Write a simple test.",
      task: "Assert that 1 + 1 equals 2 using Jest.",
      solutionCode: "test('adds 1 + 1', () => {\n  expect(1 + 1).toBe(2);\n});"
    }
  },
  {
    slug: "node-integration-testing",
    title: "35. Integration Testing",
    order: 35,
    content: "<h2>Testing the API Layer</h2><p>Using tools like Supertest to spin up the server and simulate HTTP requests against it.</p>",
    interviewQuestions: [
      { question: "How does Supertest work?", answer: "It passes the Express app object directly, bypassing actual network binding to make tests faster." },
      { question: "Should integration tests use a real DB?", answer: "Generally yes, using a dedicated test database or in-memory DB to ensure queries work." }
    ],
    practicalTask: {
      scenario: "Testing an endpoint.",
      task: "Use Supertest to GET a route and expect a 200 status.",
      solutionCode: "import request from 'supertest';\nawait request(app).get('/').expect(200);"
    }
  }
];

appendTopics("nodejs", "Node.js Enterprise Backend", "The definitive guide.", topics);
