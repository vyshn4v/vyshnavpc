import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'advanced-routing-and-custom-routers',
    title: 'Advanced Routing and Custom Routers in Express',
    order: 16,
    content: `
<h1>Advanced Routing and Custom Routers</h1>
<p>In Express, routing is the backbone of the application. As an application scales, a simple <code>app.get()</code> structure quickly becomes unmanageable. Advanced routing involves leveraging the <code>express.Router</code> class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a "mini-app".</p>
<h2>Modularizing Routes</h2>
<p>By creating modular routes, you encapsulate related functionality. For example, all user-related routes can live in a <code>userRoutes.js</code> file.</p>
<pre><code class="language-javascript">
const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('User API Time: ', Date.now());
  next();
});

router.get('/', (req, res) => {
  res.send('Get all users');
});

router.post('/', (req, res) => {
  res.send('Create a user');
});

router.get('/:id', (req, res) => {
  res.send('Get user by ID: ' + req.params.id);
});

module.exports = router;
</code></pre>
<p>You can then mount this router in your main application:</p>
<pre><code class="language-javascript">
const express = require('express');
const app = express();
const users = require('./userRoutes');

app.use('/api/users', users);
</code></pre>
<h2>Route Parameters and <code>router.param()</code></h2>
<p>Express allows you to define route parameters which are named URL segments that are used to capture the values specified at their position in the URL. You can intercept these parameters using <code>router.param()</code> to perform validation or fetch data before the route handler is executed.</p>
<pre><code class="language-javascript">
router.param('userId', async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', (req, res) => {
  // req.user is already populated by the param middleware
  res.json(req.user);
});
</code></pre>
<h2>Chaining Route Handlers with <code>app.route()</code></h2>
<p>You can create chainable route handlers for a route path by using <code>app.route()</code>. Because the path is specified at a single location, creating modular routes is helpful, as is reducing redundancy and typos.</p>
<pre><code class="language-javascript">
app.route('/api/books')
  .get((req, res) => {
    res.send('Get a random book');
  })
  .post((req, res) => {
    res.send('Add a book');
  })
  .put((req, res) => {
    res.send('Update the book');
  });
</code></pre>
<h2>Regex Routing</h2>
<p>Express paths can be regular expressions. This is extremely powerful for complex URL matching.</p>
<pre><code class="language-javascript">
// Match anything that ends in "fly"
app.get(/.*fly$/, (req, res) => {
  res.send('/.*fly$/');
});
</code></pre>
<p>This allows for highly customizable endpoint architectures, such as versioning in the path.</p>
`,
    interviewQuestions: [
      {
        question: "What is an express.Router and why is it useful?",
        answer: "express.Router is a class used to create modular, mountable route handlers. It acts as a 'mini-app', allowing you to encapsulate related routes, middleware, and logic in separate files, making large codebases manageable and maintainable."
      },
      {
        question: "How does router.param() work?",
        answer: "router.param() registers middleware that triggers only when a specific route parameter is present in the URL. It is useful for validating parameters, fetching database records associated with the parameter, and attaching them to the request object before the actual route handler executes."
      },
      {
        question: "Explain the difference between app.route() and express.Router().",
        answer: "app.route() is used to chain HTTP methods (GET, POST, PUT, etc.) for a single, specific path to avoid duplicating the path string. express.Router() is used to create a completely modular set of routes and middleware that can be mounted onto the main app at a specific path prefix."
      },
      {
        question: "Can you use regular expressions in Express routes?",
        answer: "Yes, Express allows routes to be defined using regular expressions. This provides powerful pattern matching capabilities for complex URL routing, such as matching specific file extensions or enforcing complex path formats."
      },
      {
        question: "How would you handle route versioning using Routers?",
        answer: "You can create separate router modules for each version of your API (e.g., v1Routes.js, v2Routes.js). Then, in your main app, you mount them at different base paths: app.use('/api/v1', v1Routes); app.use('/api/v2', v2Routes);"
      }
    ],
    practicalTask: {
      scenario: "Create a modular routing system for a library API.",
      task: "Create a router for '/authors' with GET, POST, and a parameterized GET '/:authorId' that validates the ID using router.param.",
      solutionCode: `
const express = require('express');
const router = express.Router();

router.param('authorId', (req, res, next, id) => {
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Author ID must be a number' });
  }
  req.authorId = id;
  next();
});

router.route('/')
  .get((req, res) => res.json({ authors: [] }))
  .post((req, res) => res.status(201).json({ message: 'Author created' }));

router.get('/:authorId', (req, res) => {
  res.json({ message: \`Fetched author \${req.authorId}\` });
});

module.exports = router;
      `
    }
  },
  {
    slug: 'deep-dive-middleware-architecture',
    title: 'Deep Dive into Express Middleware Architecture',
    order: 17,
    content: `
<h1>Deep Dive into Express Middleware Architecture</h1>
<p>Middleware functions are the lifeblood of an Express application. They are functions that have access to the request object (<code>req</code>), the response object (<code>res</code>), and the next middleware function in the application's request-response cycle. Understanding how they execute and chain is critical for mastering Express.</p>
<h2>The Request-Response Cycle</h2>
<p>When a request hits an Express app, it travels through a pipeline of middleware. Each middleware can:</p>
<ul>
<li>Execute any code.</li>
<li>Make changes to the request and the response objects.</li>
<li>End the request-response cycle (e.g., by calling <code>res.send()</code>).</li>
<li>Call the next middleware function in the stack using <code>next()</code>.</li>
</ul>
<p>If the current middleware function does not end the request-response cycle, it must call <code>next()</code> to pass control to the next middleware function. Otherwise, the request will be left hanging.</p>
<h2>Application-level vs Router-level Middleware</h2>
<p>Application-level middleware is bound to an instance of the <code>express()</code> app using <code>app.use()</code> or <code>app.METHOD()</code>. Router-level middleware works in the exact same way, except it is bound to an instance of <code>express.Router()</code>.</p>
<pre><code class="language-javascript">
// Application-level
app.use((req, res, next) => {
  console.log('App level middleware');
  next();
});

// Router-level
router.use((req, res, next) => {
  console.log('Router level middleware');
  next();
});
</code></pre>
<h2>Third-party Middleware</h2>
<p>The Express ecosystem is rich with third-party middleware. Common examples include:</p>
<ul>
<li><strong>body-parser:</strong> Parses incoming request bodies in a middleware before your handlers. (Note: Express 4.16+ has this built-in via <code>express.json()</code> and <code>express.urlencoded()</code>).</li>
<li><strong>cookie-parser:</strong> Parse Cookie header and populate <code>req.cookies</code>.</li>
<li><strong>morgan:</strong> HTTP request logger middleware.</li>
<li><strong>helmet:</strong> Secures Express apps by setting various HTTP headers.</li>
<li><strong>cors:</strong> Middleware that can be used to enable CORS with various options.</li>
</ul>
<pre><code class="language-javascript">
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
</code></pre>
<h2>Writing Custom Middleware Factories</h2>
<p>Often, you need middleware that accepts configuration options. To do this, you write a middleware factory—a function that returns a middleware function.</p>
<pre><code class="language-javascript">
function requireRole(role) {
  return function(req, res, next) {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).send('Forbidden: Insufficient role');
    }
  };
}

app.post('/admin', requireRole('admin'), (req, res) => {
  res.send('Welcome, Admin.');
});
</code></pre>
<h2>Skipping Middleware</h2>
<p>To skip the rest of the middleware functions from a router middleware stack, call <code>next('route')</code> to pass control to the next route. Note: <code>next('route')</code> will work only in middleware functions that were loaded by using the <code>app.METHOD()</code> or <code>router.METHOD()</code> functions.</p>
`,
    interviewQuestions: [
      {
        question: "What exactly is middleware in Express?",
        answer: "Middleware are functions that intercept incoming requests before they reach the final route handler. They have access to the req, res objects and the next() function. They can modify requests/responses, execute arbitrary code, or end the response cycle entirely."
      },
      {
        question: "What happens if a middleware function does not call next() and does not send a response?",
        answer: "The request will be left hanging indefinitely, eventually resulting in a timeout on the client side. Every middleware must either end the cycle (e.g., res.send, res.json) or pass control to the next middleware via next()."
      },
      {
        question: "How do you create configurable middleware?",
        answer: "You create a middleware factory: a standard function that takes configuration parameters and returns a middleware function `(req, res, next)`. The returned function forms a closure over the configuration variables."
      },
      {
        question: "What is next('route')?",
        answer: "next('route') is a special call that bypasses all remaining middleware in the current route handler array and passes control to the next matching route block. It only works within app.METHOD or router.METHOD."
      },
      {
        question: "List some common third-party middleware used in Express.",
        answer: "Common ones include: Morgan (logging), Helmet (security headers), CORS (Cross-Origin Resource Sharing), Cookie-Parser (parsing cookies), and Express-Rate-Limit (rate limiting)."
      }
    ],
    practicalTask: {
      scenario: "Create a configurable rate-limiting mock middleware.",
      task: "Write a middleware factory that limits requests per minute. If exceeded, return a 429 status.",
      solutionCode: `
function mockRateLimiter(limitPerMinute) {
  const ipCounts = new Map();
  
  return function(req, res, next) {
    const ip = req.ip;
    const currentCount = ipCounts.get(ip) || 0;
    
    if (currentCount >= limitPerMinute) {
      return res.status(429).send('Too Many Requests');
    }
    
    ipCounts.set(ip, currentCount + 1);
    
    // reset mock for testing purposes after 1 minute (simplified)
    setTimeout(() => ipCounts.delete(ip), 60000);
    next();
  };
}

app.use(mockRateLimiter(100));
      `
    }
  },
  {
    slug: 'advanced-error-handling',
    title: 'Advanced Error Handling Strategies',
    order: 18,
    content: `
<h1>Advanced Error Handling Strategies</h1>
<p>Error handling is what separates a fragile application from a robust one. Express provides a default error handler, but for production APIs, you need a custom, centralized error handling strategy that catches both synchronous and asynchronous errors safely.</p>
<h2>The Error Handling Middleware</h2>
<p>Error-handling middleware is defined just like regular middleware, except it has four arguments instead of three: <code>(err, req, res, next)</code>. Express recognizes it as an error handler purely by its arity (number of arguments).</p>
<pre><code class="language-javascript">
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});
</code></pre>
<p><strong>Important:</strong> Error handling middleware must always be added at the very end of your middleware stack, after all other <code>app.use()</code> and route calls.</p>
<h2>Handling Asynchronous Errors</h2>
<p>Prior to Express 5, errors thrown inside asynchronous functions (promises/async-await) are not automatically caught by the Express error handler. You must catch them manually and pass them to <code>next(err)</code>.</p>
<pre><code class="language-javascript">
app.get('/data', async (req, res, next) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (err) {
    next(err); // Pass async error to the global handler
  }
});
</code></pre>
<p>To avoid writing try-catch blocks in every route, developers often use an async wrapper utility, or packages like <code>express-async-errors</code>.</p>
<pre><code class="language-javascript">
// Async Handler Utility
const asyncHandler = fn => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/data', asyncHandler(async (req, res, next) => {
  const data = await fetchData(); // Thrown errors automatically go to next()
  res.json(data);
}));
</code></pre>
<h2>Creating Custom Operational Errors</h2>
<p>It is crucial to distinguish between <em>Operational Errors</em> (predictable, like 'User not found' or validation failures) and <em>Programmer Errors</em> (bugs, like reading property of undefined). Creating a custom AppError class helps manage this.</p>
<pre><code class="language-javascript">
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = \`\${statusCode}\`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Flag to identify predictable errors

    Error.captureStackTrace(this, this.constructor);
  }
}

// Throwing an operational error
if (!user) {
  return next(new AppError('User not found', 404));
}
</code></pre>
<h2>Global Error Handling Logic</h2>
<p>Your global error handler should behave differently in development vs. production. In development, you want maximum detail (stack traces). In production, you want minimal detail to avoid leaking system information, unless it's a trusted operational error.</p>
<pre><code class="language-javascript">
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else if (process.env.NODE_ENV === 'production') {
    if (err.isOperational) {
      // Trusted operational error: send message to client
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Programming or unknown error: don't leak details
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
  }
};
</code></pre>
`,
    interviewQuestions: [
      {
        question: "How does Express differentiate an error handling middleware from standard middleware?",
        answer: "Express differentiates them by the number of arguments (arity). An error handler MUST have exactly four arguments: (err, req, res, next)."
      },
      {
        question: "Why does an Express app sometimes crash ungracefully when using async/await?",
        answer: "In Express 4.x, unhandled promise rejections inside async route handlers bypass the global error handler and bubble up to Node.js, crashing the process. You must wrap async code in try/catch and call next(err), or use an async wrapper utility."
      },
      {
        question: "What is the difference between an operational error and a programmer error?",
        answer: "Operational errors are predictable runtime problems (e.g., invalid input, failing to connect to a DB, rate limits). Programmer errors are bugs in the code (e.g., TypeError, ReferenceError). Operational errors should be gracefully handled and reported to the user; programmer errors often require restarting the app."
      },
      {
        question: "Where should the global error handling middleware be placed in the app.js file?",
        answer: "It must be the absolute last middleware defined, after all routers and 404 handlers. If it is placed before routes, the errors thrown in those routes won't be caught."
      },
      {
        question: "How do you handle 404 Not Found errors for unhandled routes?",
        answer: "Right before the global error handler, add a catch-all route: `app.all('*', (req, res, next) => next(new AppError('Route not found', 404)));`. This forces a 404 error into the global error handler."
      }
    ],
    practicalTask: {
      scenario: "Implement an async wrapper and custom error class.",
      task: "Create an AppError class and an asyncHandler. Use them in a route to throw a 400 Bad Request error.",
      solutionCode: `
class AppError extends Error {
  constructor(msg, code) {
    super(msg);
    this.statusCode = code;
    this.isOperational = true;
  }
}

const asyncHandler = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

app.post('/test', asyncHandler(async (req, res, next) => {
  const { data } = req.body;
  if (!data) throw new AppError('Data is required', 400);
  res.json({ success: true });
}));

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});
      `
    }
  },
  {
    slug: 'express-security-best-practices',
    title: 'Security Best Practices in Express (Advanced)',
    order: 19,
    content: `
<h1>Security Best Practices in Express</h1>
<p>Express applications, by default, do not come with hardened security. It is the developer's responsibility to implement defenses against common web vulnerabilities like XSS, CSRF, NoSQL Injection, and Parameter Pollution.</p>
<h2>1. HTTP Headers Security (Helmet)</h2>
<p>The <code>helmet</code> package is a collection of 15 smaller middleware functions that set HTTP response headers. It protects your app from some well-known web vulnerabilities by setting headers appropriately.</p>
<pre><code class="language-javascript">
const helmet = require('helmet');
app.use(helmet());
</code></pre>
<p>This mitigates issues like Clickjacking (X-Frame-Options), hides the X-Powered-By header, enforces HTTPS via HSTS, and more.</p>
<h2>2. Cross-Site Scripting (XSS) Prevention</h2>
<p>XSS attacks occur when an attacker injects malicious scripts into your application. To prevent this, never trust user input. Use libraries like <code>xss-clean</code> to sanitize user input coming from req.body, req.query, or req.params.</p>
<pre><code class="language-javascript">
const xss = require('xss-clean');
// Data Sanitization against XSS
app.use(xss());
</code></pre>
<p>Furthermore, ensure your frontend framework (React, Angular, Vue) escapes HTML by default. If rendering on the server (e.g., EJS, Pug), strictly use the escape syntax.</p>
<h2>3. NoSQL Injection Prevention</h2>
<p>If you are using MongoDB, attackers can pass objects instead of strings in the request body to bypass authentication. For example, <code>{ "email": { "$gt": "" }, "password": { "$gt": "" } }</code>.</p>
<p>Use <code>express-mongo-sanitize</code> to remove keys containing prohibited characters like <code>$</code> or <code>.</code>.</p>
<pre><code class="language-javascript">
const mongoSanitize = require('express-mongo-sanitize');
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
</code></pre>
<h2>4. Rate Limiting</h2>
<p>To prevent Brute Force and Denial of Service (DoS) attacks, limit the number of requests a single IP can make within a time window.</p>
<pre><code class="language-javascript">
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter); // Apply to API routes
</code></pre>
<h2>5. HTTP Parameter Pollution (HPP)</h2>
<p>Attackers can send duplicate query parameters to cause application crashes or bypass logic (e.g., <code>?sort=name&sort=age</code>). The <code>hpp</code> middleware resolves this by keeping only the last parameter value, or you can whitelist certain parameters.</p>
<pre><code class="language-javascript">
const hpp = require('hpp');

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
  ]
}));
</code></pre>
<h2>6. CSRF Protection</h2>
<p>Cross-Site Request Forgery (CSRF) is mitigated by using anti-CSRF tokens. While modern SPAs using Authorization headers (Bearer tokens) are largely immune to CSRF, session-based (cookie) apps must use libraries like <code>csurf</code> to enforce token validation on state-changing requests (POST, PUT, DELETE).</p>
`,
    interviewQuestions: [
      {
        question: "What does the Helmet middleware do in Express?",
        answer: "Helmet is a collection of middleware functions that secure Express apps by setting various HTTP response headers. It hides X-Powered-By, sets X-Frame-Options to prevent clickjacking, sets strict transport security (HSTS), and more."
      },
      {
        question: "How do you protect a MongoDB-backed Express app against NoSQL injection?",
        answer: "By using a middleware like `express-mongo-sanitize`. It intercepts req.body, req.query, and req.params and removes any keys that contain a `$` or `.` character, preventing operators like `$gt` from being executed maliciously."
      },
      {
        question: "What is HTTP Parameter Pollution, and how do you prevent it?",
        answer: "HPP occurs when multiple query parameters with the same name are sent (e.g., `?id=1&id=2`). Express parses this into an array `[1, 2]`, which can crash functions expecting a string. You prevent it using the `hpp` middleware, which takes the last value or allows whitelisted arrays."
      },
      {
        question: "Why should you remove the X-Powered-By header?",
        answer: "The X-Powered-By header tells the client which technology the server is running (e.g., Express). Revealing your tech stack gives attackers an advantage, allowing them to target known vulnerabilities specific to that framework."
      },
      {
        question: "How does rate limiting improve API security?",
        answer: "Rate limiting restricts the number of requests an IP address can make in a given timeframe. It prevents brute-force password guessing attacks, credential stuffing, and mitigates basic Denial of Service (DoS) attacks."
      }
    ],
    practicalTask: {
      scenario: "Secure an existing Express API.",
      task: "Implement Helmet, Rate Limiting, and MongoDB Sanitization middleware on the global app instance.",
      solutionCode: `
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests, try again later.'
});
app.use('/api', limiter);

// Body parser
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

app.listen(3000);
      `
    }
  },
  {
    slug: 'performance-optimization-profiling',
    title: 'Performance Optimization and Profiling',
    order: 20,
    content: `
<h1>Performance Optimization and Profiling</h1>
<p>As Express applications scale to handle high traffic, performance bottlenecks become evident. Node.js is single-threaded; blocking the event loop or poor memory management will severely degrade throughput. Optimization involves code-level changes, caching, and utilizing the underlying OS infrastructure.</p>
<h2>1. Do Not Block the Event Loop</h2>
<p>Node.js handles high concurrency using an asynchronous event loop. CPU-intensive tasks (like complex cryptography, huge JSON parsing, or massive array sorts) will block the loop, preventing the server from handling other incoming requests.</p>
<ul>
<li>Offload CPU-intensive tasks to <strong>Worker Threads</strong> or entirely separate microservices.</li>
<li>Ensure database queries are heavily indexed.</li>
<li>Use asynchronous file system methods (<code>fs.readFile</code> instead of <code>fs.readFileSync</code>).</li>
</ul>
<h2>2. Use Compression</h2>
<p>Gzip compressing HTTP responses significantly decreases the size of the response body, increasing speed and reducing bandwidth consumption. Use the <code>compression</code> middleware.</p>
<pre><code class="language-javascript">
const compression = require('compression');
app.use(compression());
</code></pre>
<p><em>Note: In large-scale deployments, it's often better to let a reverse proxy like Nginx or AWS API Gateway handle compression instead of Node.js.</em></p>
<h2>3. Node.js Clustering (PM2)</h2>
<p>Because Node.js is single-threaded, a standard Express app runs on a single CPU core. To utilize multi-core servers, you must run a cluster of Node processes. The easiest way to manage this in production is using <strong>PM2</strong>.</p>
<pre><code class="language-bash">
pm2 start server.js -i max
</code></pre>
<p>This command starts as many instances of your Express app as there are CPU cores, load balancing requests among them.</p>
<h2>4. Caching Responses</h2>
<p>If an endpoint returns data that doesn't change frequently, avoid hitting the database on every request. Implement caching using Redis.</p>
<pre><code class="language-javascript">
const redis = require('redis');
const client = redis.createClient();

const cacheMiddleware = async (req, res, next) => {
  const data = await client.get(req.originalUrl);
  if (data) {
    return res.json(JSON.parse(data));
  }
  next();
};

app.get('/api/stats', cacheMiddleware, async (req, res) => {
  const stats = await computeHeavyStats(); // DB call
  await client.setEx(req.originalUrl, 3600, JSON.stringify(stats)); // cache for 1 hr
  res.json(stats);
});
</code></pre>
<h2>5. Profiling with Node Inspect and Clinic.js</h2>
<p>To identify bottlenecks and memory leaks, use profiling tools.</p>
<ul>
<li><strong>Node.js Inspector:</strong> Run your app with <code>node --inspect server.js</code> and open Chrome DevTools (<code>chrome://inspect</code>) to take memory snapshots and CPU profiles.</li>
<li><strong>Clinic.js:</strong> A suite of tools to diagnose performance issues. Running <code>clinic doctor -- node server.js</code> generates a visual report identifying event loop delays, IO issues, or CPU spikes.</li>
</ul>
<h2>6. Set NODE_ENV to production</h2>
<p>Always ensure <code>process.env.NODE_ENV</code> is set to <code>"production"</code>. Express caches view templates and CSS, and skips verbose error messages when running in production mode, yielding up to a 3x performance boost.</p>
`,
    interviewQuestions: [
      {
        question: "Why should you never use synchronous functions (like fs.readFileSync) in an Express route?",
        answer: "Because Node.js runs on a single thread event loop. Synchronous operations block the thread, meaning the server cannot process any other incoming requests until that synchronous operation finishes, causing massive latency under load."
      },
      {
        question: "How does setting NODE_ENV='production' improve Express performance?",
        answer: "Express acts differently in production mode. It caches view templates, caches CSS extensions, and generates less verbose error messages. This can result in significant performance improvements."
      },
      {
        question: "What is clustering in Node.js, and why is it necessary for scaling Express apps?",
        answer: "A single Node.js instance runs on a single CPU core. Clustering forks multiple instances of the Node process (usually matching the number of CPU cores) and load balances incoming connections across them, drastically increasing throughput."
      },
      {
        question: "When should you use the `compression` middleware in Express?",
        answer: "Compression should be used to Gzip response bodies, reducing payload size over the network. However, for high-traffic apps, it's more efficient to offload compression to a reverse proxy like Nginx rather than having the Node process burn CPU cycles compressing data."
      },
      {
        question: "What tools would you use to find a memory leak in an Express application?",
        answer: "I would use the built-in Node inspector (`node --inspect`) and Chrome DevTools to take and compare heap snapshots. Additionally, tools like Clinic.js (Clinic Memory) can help visualize memory spikes and identify the leaking objects."
      }
    ],
    practicalTask: {
      scenario: "Optimize a static payload response.",
      task: "Add compression middleware and create an in-memory caching mechanism for a slow route.",
      solutionCode: `
const express = require('express');
const compression = require('compression');
const app = express();

app.use(compression());

const cache = new Map();

app.get('/heavy-data', (req, res) => {
  if (cache.has('/heavy-data')) {
    return res.json(cache.get('/heavy-data'));
  }
  
  // Simulate heavy computation
  let data = 0;
  for (let i = 0; i < 1e7; i++) data++;
  
  cache.set('/heavy-data', { result: data });
  res.json({ result: data });
});
      `
    }
  }
];

appendTopics('express', 'Express.js API Design', 'The definitive guide.', topics);
