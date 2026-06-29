import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'express-under-the-hood',
    title: 'Express under the Hood: How Express works internally',
    order: 26,
    content: `
<h1>Express under the Hood: How Express works internally</h1>
<p>To truly master Express, you must understand what it actually is: a routing and middleware web framework built directly on top of Node.js's native <code>http</code> module. In fact, an Express application is essentially just a single callback function passed to <code>http.createServer()</code>.</p>

<h2>The Node.js http module</h2>
<p>In native Node.js, you create a web server like this:</p>
<pre><code class="language-javascript">
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.end('Hello World');
  }
});

server.listen(3000);
</code></pre>
<p>Express abstracts away the messy <code>if/else</code> logic for URL routing and provides a streamlined middleware pipeline.</p>

<h2>What is app?</h2>
<p>When you call <code>const app = express()</code>, it returns a function. This function has properties and methods attached to it (like <code>app.get</code>, <code>app.listen</code>), but fundamentally, <code>app</code> itself is the <code>(req, res)</code> handler function expected by Node's HTTP module.</p>
<pre><code class="language-javascript">
// What Express's app.listen actually does under the hood:
app.listen = function() {
  var server = http.createServer(this); // 'this' is the app function
  return server.listen.apply(server, arguments);
};
</code></pre>

<h2>The Router and Layer Stack</h2>
<p>Internally, Express maintains a <code>Router</code> object containing an array called a <code>stack</code>. Every time you call <code>app.use()</code> or <code>app.get()</code>, Express creates a <code>Layer</code> object and pushes it onto this stack.</p>
<p>A Layer contains:</p>
<ul>
<li><strong>path:</strong> The route to match (e.g., '/api/users')</li>
<li><strong>handle:</strong> The middleware function you provided</li>
<li><strong>match():</strong> A function to test if the incoming request URL matches the Layer's path.</li>
</ul>

<h2>The Execution Pipeline</h2>
<p>When a request arrives, Express invokes its internal <code>handle(req, res, callback)</code> method. It starts at index 0 of the stack:</p>
<ol>
<li>It checks if the current Layer matches the request path and method.</li>
<li>If it matches, it calls the Layer's <code>handle</code> function (your middleware).</li>
<li>Your middleware eventually calls <code>next()</code>.</li>
<li>The <code>next()</code> function increments the stack index and recursively calls the next matching Layer.</li>
<li>If an error is passed to <code>next(err)</code>, Express skips all standard Layers and only looks for Layers whose <code>handle</code> function has an arity of 4 (Error Handlers).</li>
</ol>
`,
    interviewQuestions: [
      {
        question: "What exactly is the `app` object returned by `express()`?",
        answer: "The `app` object is fundamentally a JavaScript function designed to be passed as the request listener callback to Node's native `http.createServer((req, res) => {})`."
      },
      {
        question: "How does Express handle the middleware pipeline internally?",
        answer: "Express stores middleware in an array called a 'stack' within a Router object. Each entry is a 'Layer'. When a request comes in, Express iterates through this array. The `next()` function is just a mechanism that moves the internal pointer to the next matching Layer in the array and executes it."
      },
      {
        question: "Does Express replace Node's native `req` and `res` objects?",
        answer: "No, Express does not replace them. Instead, it extends Node's native `http.IncomingMessage` (req) and `http.ServerResponse` (res) prototypes by attaching helper methods like `req.params`, `res.json()`, and `res.status()`."
      },
      {
        question: "How does Express differentiate between standard middleware and error-handling middleware internally?",
        answer: "By checking the `Function.length` property, which returns the number of arguments a function expects (its arity). If `handle.length === 4`, Express treats it as an error handler. Otherwise, it's treated as standard middleware."
      },
      {
        question: "What happens if you never call `res.end()` or `res.send()` in Express?",
        answer: "The underlying HTTP request remains open because the Node.js `http` module is waiting for the response stream to close. Eventually, the client's browser will time out."
      }
    ],
    practicalTask: {
      scenario: "Simulate a basic Express middleware stack.",
      task: "Create a simple class 'MiniExpress' that has a 'use(fn)' method to add middleware to a stack, and a 'handle(req, res)' method that executes them in order using a next() function.",
      solutionCode: `
class MiniExpress {
  constructor() { this.stack = []; }
  
  use(fn) { this.stack.push(fn); }
  
  handle(req, res) {
    let index = 0;
    const next = () => {
      if (index < this.stack.length) {
        const middleware = this.stack[index++];
        middleware(req, res, next);
      }
    };
    next();
  }
}

const app = new MiniExpress();
app.use((req, res, next) => { req.user = 'Alice'; next(); });
app.use((req, res, next) => { console.log(req.user); });

app.handle({ url: '/' }, {});
      `
    }
  },
  {
    slug: 'express-microservices',
    title: 'Express with Microservices Architecture',
    order: 27,
    content: `
<h1>Express with Microservices Architecture</h1>
<p>As applications grow, a monolithic Express app becomes difficult to scale, deploy, and maintain. A microservices architecture breaks the application down into small, independent, loosely-coupled Express services that communicate with each other over a network.</p>

<h2>The API Gateway Pattern</h2>
<p>In a microservices architecture, you shouldn't expose 50 different server IPs to the frontend client. Instead, you use an <strong>API Gateway</strong>. The Gateway is a single entry point (often itself an Express app or Nginx server) that routes requests to the appropriate underlying microservice.</p>
<pre><code class="language-javascript">
// gateway.js - using http-proxy-middleware
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/users', createProxyMiddleware({ 
  target: 'http://user-service:3001', 
  changeOrigin: true 
}));

app.use('/orders', createProxyMiddleware({ 
  target: 'http://order-service:3002', 
  changeOrigin: true 
}));

app.listen(3000, () => console.log('API Gateway running'));
</code></pre>

<h2>Inter-Service Communication</h2>
<p>Microservices need to talk to each other. There are two primary ways:</p>
<ol>
<li><strong>Synchronous (HTTP/REST or gRPC):</strong> Service A sends an HTTP request to Service B and waits for the response. Simple, but creates tight coupling and latency bottlenecks. Use Axios or node-fetch within Express.</li>
<li><strong>Asynchronous (Message Brokers):</strong> Service A emits an event to a message broker (like RabbitMQ, Kafka, or Redis Pub/Sub). Service B listens for that event and reacts independently. This ensures high availability and decoupled scaling.</li>
</ol>

<h2>Authentication in Microservices</h2>
<p>Do not validate passwords in every service. The standard pattern is stateless JWTs (JSON Web Tokens). The API Gateway (or a dedicated Auth Service) verifies the credentials and issues a JWT. The client includes this JWT in subsequent requests. The Gateway verifies the JWT signature and forwards the user ID in the headers to the downstream Express microservices, which inherently trust the Gateway.</p>

<h2>Distributed Tracing</h2>
<p>When an error occurs across 5 microservices, reading logs is impossible unless they are tied together. You must inject a <code>X-Request-Id</code> or <code>Correlation-ID</code> at the API Gateway. Every microservice must read this ID from the incoming headers and attach it to its own logs and outbound requests.</p>
`,
    interviewQuestions: [
      {
        question: "What is an API Gateway and why is it used in Express microservices?",
        answer: "An API Gateway is a single server that acts as an entry point for all client requests. It handles routing to specific microservices, rate limiting, SSL termination, and often global authentication, hiding the complex backend infrastructure from the client."
      },
      {
        question: "How should authentication be handled across multiple Express microservices?",
        answer: "Using stateless JWTs. An Auth service issues the JWT. The API gateway verifies the JWT signature on incoming requests, decodes it, and passes the user ID/roles as custom HTTP headers (e.g., X-User-Id) to the downstream microservices, keeping them lightweight and decoupled from auth logic."
      },
      {
        question: "What is the difference between synchronous and asynchronous inter-service communication?",
        answer: "Synchronous communication (REST HTTP calls) requires both services to be online; the caller waits for a response, creating tight coupling. Asynchronous communication (RabbitMQ/Kafka) uses event queues. The caller fires an event and forgets it, allowing the receiver to process it whenever ready, providing better resilience."
      },
      {
        question: "What is a Correlation ID?",
        answer: "A Correlation ID (or trace ID) is a unique identifier generated at the API Gateway and passed along in the HTTP headers to every microservice involved in handling a single client request. It is crucial for debugging and distributed log aggregation (e.g., using ELK stack or Datadog)."
      },
      {
        question: "How do you handle database transactions that span across multiple microservices?",
        answer: "Distributed transactions are very complex. You cannot use standard ACID SQL transactions. Instead, you must use the Saga Pattern, where a transaction is a sequence of local transactions. If one step fails, the system executes compensating transactions to undo the previous steps."
      }
    ],
    practicalTask: {
      scenario: "Implement an API Gateway with Request IDs.",
      task: "Create an Express gateway that attaches a unique X-Request-ID header to incoming requests and logs it before proxying.",
      solutionCode: `
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('x-request-id', req.id);
  console.log(\`[\${req.id}] Incoming \${req.method} \${req.url}\`);
  next();
});

app.get('/api/users', (req, res) => {
  // In reality, this proxies to user-service, passing the req.id in headers
  res.json({ service: 'users', requestId: req.id });
});

app.listen(3000);
      `
    }
  },
  {
    slug: 'advanced-caching',
    title: 'Implementing Advanced Rate Limiting and Caching',
    order: 28,
    content: `
<h1>Implementing Advanced Rate Limiting and Caching</h1>
<p>To protect an Express API from abuse (DDoS) and to handle massive read-heavy traffic, advanced rate-limiting and distributed caching using Redis are absolute necessities.</p>

<h2>Distributed Rate Limiting</h2>
<p>Using <code>express-rate-limit</code> with memory store is fine for a single Node instance. However, if you are running 5 instances of your Express app behind a load balancer, memory-based limits fail (a user allowed 100 reqs gets 100 per instance = 500 reqs total). You must use a centralized Redis store.</p>
<pre><code class="language-javascript">
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const { createClient } = require('redis');

const redisClient = createClient({ url: 'redis://localhost:6379' });
redisClient.connect();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the \`RateLimit-*\` headers
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

app.use('/api/', apiLimiter);
</code></pre>

<h2>Advanced Caching with Redis</h2>
<p>Caching API responses drastically reduces database load. The challenge is <strong>Cache Invalidation</strong>. When data updates, the cache must be cleared, or users will see stale data.</p>
<pre><code class="language-javascript">
// middleware/cache.js
const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    // Generate cache key based on URL and query params
    const key = \`__express__\${req.originalUrl || req.url}\`;
    
    const cachedBody = await redisClient.get(key);
    if (cachedBody) {
      return res.type('json').send(cachedBody);
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        // Only cache successful GET requests
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisClient.setEx(key, duration, body);
        }
        res.sendResponse(body);
      };
      next();
    }
  };
};

app.get('/users', cacheMiddleware(3600), async (req, res) => {
  const users = await db.query('SELECT * FROM users'); // Slow query
  res.json(users);
});
</code></pre>
<p>When you update a user via POST/PUT, you must invalidate the cache:</p>
<pre><code class="language-javascript">
app.post('/users', async (req, res) => {
  await db.query('INSERT INTO users...');
  // Invalidate cache
  await redisClient.del('__express__/users');
  res.status(201).send('Created');
});
</code></pre>

<h2>ETags</h2>
<p>Express automatically generates ETags (Entity Tags) for responses. If the client sends a request with an <code>If-None-Match</code> header containing the ETag, and the Express response generates the same ETag, Express returns a <code>304 Not Modified</code> with an empty body, saving massive bandwidth.</p>
`,
    interviewQuestions: [
      {
        question: "Why does memory-based rate limiting fail in a clustered or load-balanced Express environment?",
        answer: "Memory-based stores are local to a specific Node process. If you have 5 load-balanced Node instances, a user could theoretically send 5 times the allowed limit by hitting different instances. A centralized store like Redis ensures the count is shared globally across all instances."
      },
      {
        question: "What is Cache Invalidation, and why is it notoriously difficult?",
        answer: "Cache invalidation is the process of removing or updating cached data when the underlying database source changes. It's difficult because if you miss invalidating a cache upon a database update, the client receives stale data. Tracking exactly which keys to delete requires precise logic."
      },
      {
        question: "How do you cache an Express response when the `res.send()` function doesn't return data to the middleware?",
        answer: "You must override or 'monkey patch' the `res.send` function. You store the original `res.send`, assign a new function to it that intercepts the `body` string, saves it to Redis, and then calls the original `res.send` to dispatch the data to the client."
      },
      {
        question: "What is an ETag and how does Express handle it?",
        answer: "An ETag is a hash of the response body. Express automatically generates and attaches it to the response headers. If the client includes this hash in subsequent requests (If-None-Match) and the server's newly generated hash matches, Express returns a 304 Not Modified status, saving bandwidth by not sending the body again."
      },
      {
        question: "How would you structure a Redis cache key for an endpoint with query parameters (e.g., /api/products?sort=price)?",
        answer: "The cache key must include the query string, because different query parameters return different data. `req.originalUrl` is perfect for this, as it contains both the path and the raw query string."
      }
    ],
    practicalTask: {
      scenario: "Implement manual Cache Invalidation.",
      task: "Create a GET route that caches user data in a Map, and a POST route that creates a user and clears the Map cache.",
      solutionCode: `
const cache = new Map();

app.get('/users', (req, res) => {
  if (cache.has('users')) return res.json(cache.get('users'));
  
  const data = [{ id: 1, name: 'Alice' }];
  cache.set('users', data);
  res.json(data);
});

app.post('/users', (req, res) => {
  // DB logic here...
  cache.delete('users'); // Invalidate cache
  res.status(201).send('User created and cache cleared');
});
      `
    }
  },
  {
    slug: 'graceful-shutdown',
    title: 'Graceful Shutdown and Process Management',
    order: 29,
    content: `
<h1>Graceful Shutdown and Process Management</h1>
<p>When you deploy an Express application, occasionally the server must be restarted or shut down (e.g., during a deployment rollout, scale-down, or uncaught exception). If you simply kill the Node process, any active HTTP requests and database queries are abruptly severed, resulting in data corruption and angry users. <strong>Graceful shutdown</strong> ensures active connections finish before the server dies.</p>

<h2>Signals: SIGTERM and SIGINT</h2>
<p>Orchestrators like Kubernetes or process managers like PM2 stop applications by sending POSIX signals, specifically <code>SIGTERM</code> (terminate). Pressing Ctrl+C in the terminal sends <code>SIGINT</code> (interrupt).</p>
<p>Node.js allows you to listen for these signals. By default, Node will exit immediately on SIGTERM. You must intercept it to shut down gracefully.</p>

<h2>Implementing Graceful Shutdown in Express</h2>
<p>To gracefully shut down, you must:</p>
<ol>
<li>Stop accepting new requests (close the HTTP server).</li>
<li>Wait for existing active requests to finish and respond.</li>
<li>Close database connections.</li>
<li>Exit the process safely.</li>
</ol>

<pre><code class="language-javascript">
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const server = app.listen(3000, () => console.log('Server started'));

// The graceful shutdown function
const shutdown = (signal) => {
  console.log(\`\\n\${signal} signal received. Shutting down gracefully...\`);
  
  // 1. Stop accepting new connections
  server.close(() => {
    console.log('HTTP server closed. No new connections accepted.');
    
    // 2. Close database connections
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      
      // 3. Exit process
      process.exit(0);
    });
  });

  // Force close after 10 seconds if connections are hanging
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
</code></pre>

<h2>Handling Uncaught Exceptions and Promise Rejections</h2>
<p>If a programmer error crashes the app synchronously (Uncaught Exception) or asynchronously (Unhandled Promise Rejection), the app is in an unstable state. You should log the error, gracefully shut down the server, and let your process manager (PM2/Docker) restart the app fresh.</p>

<pre><code class="language-javascript">
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1); // Server close not needed here, state is too unstable
});
</code></pre>
`,
    interviewQuestions: [
      {
        question: "What is a graceful shutdown in a Node.js/Express application?",
        answer: "Graceful shutdown is the process of intercepting termination signals (SIGTERM/SIGINT), stopping the HTTP server from accepting new requests, allowing currently processing requests to finish, closing database connections safely, and then exiting the process."
      },
      {
        question: "Why is simply killing a Node process in production dangerous?",
        answer: "Killing the process immediately drops all active TCP connections. Any users currently uploading a file, submitting a payment, or waiting for a response will get an abrupt network error. It can also cause database transactions to fail mid-flight."
      },
      {
        question: "How do you stop an Express server from accepting new connections?",
        answer: "By calling `server.close(callback)` on the HTTP server instance returned by `app.listen()`. It stops listening on the port immediately but keeps the underlying connections open until existing requests are fulfilled."
      },
      {
        question: "What is the difference between SIGINT and SIGTERM?",
        answer: "SIGINT (Signal Interrupt) is typically sent from a terminal when the user presses Ctrl+C. SIGTERM (Signal Terminate) is sent by operating systems or orchestrators (like Docker or Kubernetes) to politely ask a process to terminate."
      },
      {
        question: "What should you do if your application encounters an `uncaughtException`?",
        answer: "You should log the error, and immediately call `process.exit(1)`. The application state is no longer guaranteed to be stable, and continuing to run could cause severe bugs or memory leaks. Let a process manager restart it."
      }
    ],
    practicalTask: {
      scenario: "Implement Graceful Shutdown.",
      task: "Write a script that intercepts SIGINT, closes the Express server, and prints a message before exiting.",
      solutionCode: `
const express = require('express');
const app = express();
const server = app.listen(3000);

process.on('SIGINT', () => {
  console.log('Caught SIGINT. Closing server...');
  server.close(() => {
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });
});
      `
    }
  },
  {
    slug: 'testing-express-apps',
    title: 'Testing Express Applications',
    order: 30,
    content: `
<h1>Testing Express Applications</h1>
<p>Automated testing ensures your API works correctly after changes. In Express, testing is generally divided into three tiers: Unit testing (testing individual functions/services), Integration testing (testing route endpoints with a database), and E2E testing.</p>

<h2>Unit Testing Express Logic</h2>
<p>Because Express routes tightly couple HTTP request and response objects, unit testing controllers directly requires complex mocking. This is why the <strong>Service Layer</strong> pattern is vital. You unit test the services directly, ignoring Express entirely.</p>
<pre><code class="language-javascript">
// user.service.test.js using Jest
const userService = require('./user.service');
const User = require('./user.model');

jest.mock('./user.model'); // Mock the database

test('should create a user', async () => {
  User.create.mockResolvedValue({ id: 1, email: 'test@test.com' });
  const result = await userService.createUser({ email: 'test@test.com' });
  expect(result.id).toBe(1);
});
</code></pre>

<h2>Integration Testing with Supertest</h2>
<p>Integration testing is where Express testing shines. The library <code>supertest</code> allows you to pass your Express <code>app</code> instance to it, and it will programmatically send HTTP requests to your routes without actually needing to listen on a network port.</p>

<pre><code class="language-javascript">
// app.js (Export the app, do NOT call app.listen here)
const express = require('express');
const app = express();
app.get('/api/ping', (req, res) => res.status(200).json({ msg: 'pong' }));
module.exports = app;

// api.test.js
const request = require('supertest');
const app = require('./app');

describe('GET /api/ping', () => {
  it('should return 200 and pong message', async () => {
    const response = await request(app).get('/api/ping');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: 'pong' });
  });
});
</code></pre>

<h2>Testing with a Real Database</h2>
<p>For integration tests, you should use a separate test database. You set up the DB connection before tests run, and clean it out after they finish.</p>
<pre><code class="language-javascript">
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URI);
});

afterEach(async () => {
  // Wipe database collections after each test to ensure isolation
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
</code></pre>

<h2>Mocking Authentication</h2>
<p>If an endpoint is protected by a JWT middleware, you don't want to perform a full login request before every single test. Instead, generate a valid JWT using your secret key in the test setup and attach it to the Supertest request headers.</p>
<pre><code class="language-javascript">
const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);

const res = await request(app)
  .post('/api/protected')
  .set('Authorization', \`Bearer \${token}\`)
  .send({ data: 'hello' });
</code></pre>
`,
    interviewQuestions: [
      {
        question: "What is Supertest and how does it work with Express?",
        answer: "Supertest is an integration testing library for Node.js. It takes an Express `app` object, internally binds it to a random port on the loopback interface, and provides a fluent API to make HTTP requests against it and assert on the responses."
      },
      {
        question: "Why should you export `app` from `app.js` and keep `app.listen()` in a separate `server.js` file?",
        answer: "If `app.listen()` is in `app.js`, importing the app into your test files will cause the server to start on the actual port, potentially causing 'port already in use' errors and hanging the test runner. Separating them allows Supertest to handle the server lifecycle ephemerally."
      },
      {
        question: "How do you achieve test isolation when running integration tests against a database?",
        answer: "By using lifecycle hooks (like Jest's `afterEach`). After every single test block, you truncate or delete all documents/rows in the test database. This ensures no state leaks from one test to another, preventing flaky tests."
      },
      {
        question: "How do you test a route that requires user authentication?",
        answer: "Instead of hitting the /login endpoint before every test, you programmatically generate a valid authentication token (e.g., using jwt.sign) within the test setup, and pass it in the Authorization header using Supertest's `.set('Authorization', token)` method."
      },
      {
        question: "Why is it hard to unit test Express Controller functions directly?",
        answer: "Controllers depend on the Express `req` and `res` objects. To test a controller directly, you must create complex mock objects for `req` and `res` (mocking methods like res.status, res.json, res.send). It's much easier to abstract logic into Services and test those instead."
      }
    ],
    practicalTask: {
      scenario: "Write an Integration Test using Supertest.",
      task: "Write a Jest test block using supertest to send a POST to /users with a JSON body, expecting a 201 status.",
      solutionCode: `
const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.json());
app.post('/users', (req, res) => res.status(201).json(req.body));

test('POST /users should return 201', async () => {
  const response = await request(app)
    .post('/users')
    .send({ name: 'Bob' });
    
  expect(response.status).toBe(201);
  expect(response.body.name).toBe('Bob');
});
      `
    }
  }
];

appendTopics('express', 'Express.js API Design', 'The definitive guide.', topics);
