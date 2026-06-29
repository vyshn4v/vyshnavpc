import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'express-architecture-intro',
    title: 'Express.js Architecture & Fundamentals',
    order: 1,
    content: `
## Express.js Architecture & Fundamentals

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. Understanding its architecture is essential for building scalable applications.

### Core Philosophy
Express is built on the concept of middleware and routing. Unlike heavily opinionated frameworks (like NestJS or Spring Boot), Express gives you the freedom to structure your application however you see fit. Under the hood, it is essentially a thin layer of features built on top of Node.js's native \`http\` module.

### How Express Works with Node.js
Node.js provides the \`http.createServer()\` method. Express wraps this and provides an \`Application\` object that manages routes, middleware, and settings. 

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
\`\`\`

### The Request-Response Object Extension
Express enhances the native \`http.IncomingMessage\` (Request) and \`http.ServerResponse\` (Response) objects.
- **req**: Added properties like \`req.params\`, \`req.query\`, \`req.body\` (with middleware), and methods like \`req.accepts()\`.
- **res**: Added methods like \`res.json()\`, \`res.send()\`, \`res.status()\`, and \`res.cookie()\`.

### Structuring an Express Application
While unopinionated, a common pattern for enterprise Express apps is the MVC (Model-View-Controller) or Layered Architecture:
1. **Routes**: Define endpoints and HTTP methods.
2. **Controllers**: Handle incoming requests and send responses.
3. **Services**: Contain business logic and interact with models.
4. **Models/DAOs**: Data Access Objects communicating with the database.

\`\`\`javascript
// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/:id', userController.getUser);
module.exports = router;
\`\`\`

\`\`\`javascript
// controllers/userController.js
const userService = require('../services/userService');

exports.getUser = async (req, res, next) => {
  try {
    const user = await userService.findUserById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
\`\`\`

### Global App Settings
Express allows setting application-level variables using \`app.set()\` and \`app.get()\`. This is commonly used for template engines, port configuration, and environment flags.
`,
    interviewQuestions: [
      { question: "What is Express.js and how does it relate to Node.js?", answer: "Express.js is a minimal and flexible web framework built on top of Node.js. It simplifies building web servers and APIs by providing robust routing and middleware capabilities, abstracting the low-level boilerplate of Node's native HTTP module." },
      { question: "Is Express.js opinionated or unopinionated? Explain.", answer: "Express is unopinionated. It does not enforce a specific directory structure, ORM, or template engine, giving developers complete freedom to choose their preferred tools and architecture." },
      { question: "How does Express augment the native Node.js Request and Response objects?", answer: "Express adds convenience methods and properties. For the Request, it adds req.query, req.params, req.body, etc. For Response, it adds res.send(), res.json(), res.status(), which handle headers and content-type automatically." },
      { question: "What is the role of app.set() and app.get()?", answer: "app.set(name, value) assigns a setting name to a value. app.get(name) retrieves it. It's often used to configure the view engine, views directory, or store global application variables." },
      { question: "Why might someone choose a layered architecture for Express?", answer: "A layered architecture (Routes -> Controllers -> Services -> Data Access) separates concerns, making the code more modular, testable, and easier to maintain, especially as the application grows." }
    ],
    practicalTask: {
      scenario: "You are setting up a new Express project and need to implement a basic controller and route structure.",
      task: "Create an Express app that serves a single GET route at '/health' returning a 200 OK with a JSON payload { status: 'UP' }, cleanly separated into a router and a controller.",
      solutionCode: `
const express = require('express');
const app = express();

// controller
const healthController = (req, res) => {
  res.status(200).json({ status: 'UP' });
};

// router
const healthRouter = express.Router();
healthRouter.get('/', healthController);

// mount
app.use('/health', healthRouter);

app.listen(3000, () => console.log('Listening on 3000'));
      `
    }
  },
  {
    slug: 'express-routing-depth',
    title: 'Routing Mechanics in Depth',
    order: 2,
    content: `
## Routing Mechanics in Depth

Routing refers to how an application's endpoints (URIs) respond to client requests. Express provides a highly capable routing mechanism that supports parameters, pattern matching, and modularization.

### Basic Routing
A route definition takes the following structure: \`app.METHOD(PATH, HANDLER)\`.

\`\`\`javascript
app.post('/api/login', (req, res) => {
  // Handles POST requests to /api/login
});
\`\`\`

### Route Parameters
Route parameters are named URL segments that capture the values specified at their position in the URL. They are accessible in \`req.params\`.

\`\`\`javascript
app.get('/users/:userId/books/:bookId', (req, res) => {
  // GET /users/34/books/8989
  const { userId, bookId } = req.params;
  res.send(\`User \${userId} requested book \${bookId}\`);
});
\`\`\`

### Query Parameters
Unlike route parameters, query parameters are appended to the URL after a \`?\` and are accessed via \`req.query\`. Express parses these automatically.

\`\`\`javascript
app.get('/search', (req, res) => {
  // GET /search?keyword=express&sort=asc
  const { keyword, sort } = req.query;
  res.send(\`Searching for \${keyword}, sorted by \${sort}\`);
});
\`\`\`

### Route Paths and Regular Expressions
Route paths can be strings, string patterns, or regular expressions.

- String pattern: \`app.get('/ab?cd', ...)\` matches \`acd\` and \`abcd\`.
- String pattern: \`app.get('/ab*cd', ...)\` matches \`abcd\`, \`abxcd\`, \`abRANDOMcd\`.
- Regular Expression: \`app.get(/.*fly$/, ...)\` matches \`/butterfly\` and \`/dragonfly\`, but not \`/butterflyman\`.

### \`express.Router\`
The \`express.Router\` class creates modular, mountable route handlers. A Router instance is a complete middleware and routing system; often referred to as a "mini-app".

\`\`\`javascript
// birds.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('Birds home page'));
router.get('/about', (req, res) => res.send('About birds'));

module.exports = router;

// app.js
const birds = require('./birds');
app.use('/birds', birds);
\`\`\`

### \`app.route()\`
You can create chainable route handlers for a route path using \`app.route()\`. This is useful for grouping methods for a single path.

\`\`\`javascript
app.route('/book')
  .get((req, res) => { res.send('Get a random book') })
  .post((req, res) => { res.send('Add a book') })
  .put((req, res) => { res.send('Update the book') });
\`\`\`
`,
    interviewQuestions: [
      { question: "How do you access route parameters and query string parameters in Express?", answer: "Route parameters are accessed via req.params (e.g., req.params.id). Query string parameters are accessed via req.query (e.g., req.query.search)." },
      { question: "What is the purpose of express.Router()?", answer: "express.Router() is used to create modular, mountable route handlers. It acts as a mini-application, allowing you to organize routes into separate files and mount them on a specific path prefix." },
      { question: "What is app.route() used for?", answer: "app.route() allows you to create chainable route handlers for a single route path. It reduces redundancy and typos when defining multiple HTTP methods (GET, POST, PUT) for the exact same URI." },
      { question: "Can you use Regular Expressions in Express routing?", answer: "Yes, Express route paths can be regular expressions. For example, app.get(/.*fly$/, ...) will match any path ending in 'fly'." },
      { question: "What happens if multiple routes match the same path in Express?", answer: "Express executes the route handlers in the order they were defined. If the first matching route handler does not terminate the request (by sending a response) or call next(), the subsequent matching routes will not be reached. If it calls next(), the next matching route or middleware will run." }
    ],
    practicalTask: {
      scenario: "You need to create a modular API for a blog system.",
      task: "Create a modular router using express.Router for posts. Implement a chainable route for '/:id' that handles GET to fetch a post and DELETE to delete it. Access the 'id' parameter.",
      solutionCode: `
const express = require('express');
const postRouter = express.Router();

postRouter.route('/:id')
  .get((req, res) => {
    res.json({ message: \`Fetched post \${req.params.id}\` });
  })
  .delete((req, res) => {
    res.json({ message: \`Deleted post \${req.params.id}\` });
  });

// In main app: app.use('/posts', postRouter);
module.exports = postRouter;
      `
    }
  },
  {
    slug: 'express-middleware-cycle',
    title: 'Middleware and the Request-Response Cycle',
    order: 3,
    content: `
## Middleware and the Request-Response Cycle

Middleware functions are the heart of Express.js. A middleware function is a function that has access to the request object (\`req\`), the response object (\`res\`), and the \`next\` function in the application's request-response cycle.

### What can Middleware do?
1. Execute any code.
2. Make changes to the request and the response objects.
3. End the request-response cycle.
4. Call the next middleware in the stack.

### Types of Middleware
1. **Application-level middleware**: Bound to an instance of \`express()\` using \`app.use()\` or \`app.METHOD()\`.
2. **Router-level middleware**: Bound to an instance of \`express.Router()\`.
3. **Error-handling middleware**: Takes 4 arguments \`(err, req, res, next)\`.
4. **Built-in middleware**: Like \`express.static\`, \`express.json\`, \`express.urlencoded\`.
5. **Third-party middleware**: Like \`helmet\`, \`cors\`, \`morgan\`.

### Middleware Execution Order
Middleware functions are executed in the exact order they are defined in the code.

\`\`\`javascript
const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next(); // Pass control to the next middleware
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});
\`\`\`

If \`next()\` is not called, the request hangs, and the client will eventually time out.

### Modifying the Request Object
Middleware is frequently used to attach data to the request object for downstream handlers to use.

\`\`\`javascript
app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

app.get('/time', (req, res) => {
  res.send(\`Request was made at: \${req.requestTime}\`);
});
\`\`\`

### Conditionally Skipping Middleware
You can skip the rest of the middleware functions in a router stack using \`next('route')\`. This only works in middleware loaded via \`app.METHOD()\` or \`router.METHOD()\`.

\`\`\`javascript
app.get('/user/:id', (req, res, next) => {
  if (req.params.id === '0') {
    next('route'); // skip to the next route
  } else {
    next(); // continue to the next middleware in THIS stack
  }
}, (req, res) => {
  res.send('Regular User');
});

app.get('/user/:id', (req, res) => {
  res.send('Special Admin User');
});
\`\`\`

### Third-Party Middleware Examples
- \`cors\`: Enables Cross-Origin Resource Sharing.
- \`morgan\`: HTTP request logger.
- \`body-parser\` (now partially built into express as \`express.json\`).

\`\`\`javascript
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
\`\`\`
`,
    interviewQuestions: [
      { question: "What is middleware in Express?", answer: "Middleware refers to functions that have access to the request object, response object, and the next middleware function in the application's request-response cycle. They can modify req/res, end the cycle, or call next()." },
      { question: "Why is the execution order of middleware important?", answer: "Middleware executes sequentially. If a middleware ends the response (e.g., res.send), subsequent middlewares are not executed. If body-parser is defined after a route handler, the route handler won't have access to the parsed body." },
      { question: "What happens if you forget to call next() inside a middleware?", answer: "If a middleware does not call next() and does not send a response, the request will hang indefinitely until the client times out." },
      { question: "How do you conditionally skip to the next route from within a middleware?", answer: "By calling next('route'). This tells Express to skip the remaining middleware functions in the current route's stack and move to the next route matching the path." },
      { question: "Name three commonly used third-party middleware packages in Express.", answer: "1. cors (for Cross-Origin Resource Sharing), 2. morgan (for HTTP request logging), 3. helmet (for setting security headers)." },
      { question: "How is error-handling middleware different from standard middleware?", answer: "Error-handling middleware is defined with four arguments instead of three: (err, req, res, next). Express recognizes it by its arity (number of arguments)." }
    ],
    practicalTask: {
      scenario: "You need a middleware that checks if an API key is present in headers.",
      task: "Write a middleware function that checks for 'x-api-key' in req.headers. If it equals 'SECRET123', call next(). Otherwise, return a 401 status with an error message.",
      solutionCode: `
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === 'SECRET123') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
};

// app.use('/api', apiKeyMiddleware);
      `
    }
  },
  {
    slug: 'express-error-handling',
    title: 'Error Handling Strategies',
    order: 4,
    content: `
## Error Handling Strategies

Robust error handling ensures your API responds predictably when things go wrong and helps prevent sensitive stack traces from leaking to the client.

### Synchronous Error Handling
In synchronous code, Express catches errors thrown inside route handlers and middleware automatically.

\`\`\`javascript
app.get('/sync-error', (req, res) => {
  throw new Error('Broken!'); // Express catches this automatically
});
\`\`\`

### Asynchronous Error Handling (Pre-Express 5)
In Express 4.x, you MUST pass asynchronous errors to the \`next()\` function. If you throw an error inside a Promise or an \`async\` function without catching it, Express will crash.

\`\`\`javascript
app.get('/async-error', async (req, res, next) => {
  try {
    const data = await someAsyncOperation();
    res.json(data);
  } catch (err) {
    next(err); // Crucial! Pass error to Express
  }
});
\`\`\`

*(Note: Express 5.x introduces native support for promise rejections, meaning you no longer have to explicitly call \`next(err)\` for async routes).*

### Custom Error-Handling Middleware
You define error-handling middleware in the same way as other middleware, except with **four** arguments: \`(err, req, res, next)\`. It must be defined **after** all other \`app.use()\` and route calls.

\`\`\`javascript
// Route throws an error
app.get('/test', (req, res, next) => {
  const err = new Error('Something went wrong!');
  err.status = 500;
  next(err);
});

// The Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  console.error(err.stack);
  
  res.status(statusCode).json({
    error: {
      message: err.message,
      // Only show stack trace in development
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
});
\`\`\`

### The "Catch-All" 404 Handler
A 404 is not an error in Express; it simply means no middleware matched the request. To handle 404s, place a normal middleware at the very end of your routes (but before the error handler).

\`\`\`javascript
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint Not Found' });
});
\`\`\`

### Wrapping Async Functions (Async Handler)
To avoid writing \`try/catch\` in every async route, developers often use a wrapper utility.

\`\`\`javascript
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/clean-async', asyncHandler(async (req, res) => {
  const data = await asyncTask(); // If this throws, asyncHandler catches it and calls next(err)
  res.json(data);
}));
\`\`\`
`,
    interviewQuestions: [
      { question: "How do you define an error-handling middleware in Express?", answer: "By defining a middleware function with exactly four arguments: (err, req, res, next). It must be placed after all other routes and middleware." },
      { question: "Why do Express apps sometimes crash when an error occurs in an async function?", answer: "In Express 4.x, asynchronous errors are not automatically caught. If an unhandled promise rejection occurs, it crashes the Node process. You must wrap async code in try/catch and call next(err)." },
      { question: "How do you handle 404 Not Found in Express?", answer: "A 404 is not an error. You handle it by adding a standard middleware (with req, res, next) at the very end of your routing stack. If a request reaches it, it means no previous route matched." },
      { question: "What is the purpose of an async wrapper function like express-async-handler?", answer: "It eliminates the need to write boilerplate try/catch blocks in every async route. It wraps the async route handler, catches any promise rejections, and automatically forwards them to next(err)." },
      { question: "What happens if you call next('some string')?", answer: "In Express, passing anything to next() (other than 'route' or 'router') is treated as an error. Express will skip all subsequent non-error middleware and jump straight to the error-handling middleware." },
      { question: "How can you prevent stack traces from leaking to the client in production?", answer: "In your error-handling middleware, check the environment variable (e.g., process.env.NODE_ENV). Only include err.stack in the response payload if the environment is 'development'." }
    ],
    practicalTask: {
      scenario: "Set up a global error handler for your Express API.",
      task: "Create a 4-argument error handler middleware that logs the error, checks for an err.statusCode (defaulting to 500), and sends a JSON response with the status code and error message.",
      solutionCode: `
app.use((err, req, res, next) => {
  console.error('[Error]:', err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
      `
    }
  },
  {
    slug: 'express-async-code',
    title: 'Express.js with Asynchronous Code',
    order: 5,
    content: `
## Express.js with Asynchronous Code

Node.js is inherently asynchronous, heavily relying on callbacks, Promises, and \`async/await\`. Modern Express applications use \`async/await\` extensively for database queries, file I/O, and external API calls.

### The Evolution of Async in Express

**1. Callbacks (The Old Way)**
Early Node code was prone to "Callback Hell."
\`\`\`javascript
app.get('/user', (req, res) => {
  db.findUser(req.query.id, (err, user) => {
    if (err) return res.status(500).send(err);
    db.getUserPosts(user.id, (err, posts) => {
      if (err) return res.status(500).send(err);
      res.json({ user, posts });
    });
  });
});
\`\`\`

**2. Promises (.then / .catch)**
Promises flattened the code structure.
\`\`\`javascript
app.get('/user', (req, res, next) => {
  db.findUser(req.query.id)
    .then(user => db.getUserPosts(user.id))
    .then(posts => res.json(posts))
    .catch(next); // Clean error forwarding
});
\`\`\`

**3. Async/Await (The Modern Standard)**
Async/await makes asynchronous code look synchronous, vastly improving readability.
\`\`\`javascript
app.get('/user', async (req, res, next) => {
  try {
    const user = await db.findUser(req.query.id);
    const posts = await db.getUserPosts(user.id);
    res.json({ user, posts });
  } catch (err) {
    next(err);
  }
});
\`\`\`

### Concurrent Execution
When route handlers need to fetch multiple independent resources, avoid awaiting them sequentially. Use \`Promise.all()\` to run them concurrently and reduce response time.

**Anti-Pattern (Sequential):**
\`\`\`javascript
app.get('/dashboard', async (req, res, next) => {
  try {
    const users = await db.getUsers();       // Takes 1s
    const metrics = await db.getMetrics();   // Takes 1s
    // Total time: 2s
    res.json({ users, metrics });
  } catch (err) { next(err); }
});
\`\`\`

**Best Practice (Concurrent):**
\`\`\`javascript
app.get('/dashboard', async (req, res, next) => {
  try {
    const [users, metrics] = await Promise.all([
      db.getUsers(),
      db.getMetrics()
    ]); // Total time: 1s
    res.json({ users, metrics });
  } catch (err) { next(err); }
});
\`\`\`

### Event Loop Considerations
Because Node is single-threaded, heavy synchronous computation in an Express route will block the Event Loop, causing ALL other requests to hang.
- **Rule:** Never execute CPU-heavy tasks (like massive synchronous JSON parsing or heavy cryptography) directly in the route handler.
- **Solution:** Offload heavy tasks to Worker Threads (\`worker_threads\`) or a separate queue/service (like Redis/Bull).

### Express 5.0 and Promises
When migrating to Express 5.0, route handlers and middleware that return a Promise (or are \`async\`) will automatically pass rejections to \`next(err)\`. This will eliminate the need for manual \`try/catch\` and \`asyncHandler\` wrappers.
`,
    interviewQuestions: [
      { question: "How do you handle asynchronous operations in an Express route handler?", answer: "You typically mark the route handler function as async and use the await keyword for asynchronous operations like DB calls. You must wrap the code in a try/catch block and pass any errors to next(err) (in Express 4)." },
      { question: "What is 'Callback Hell' and how did modern Node/Express solve it?", answer: "Callback hell refers to deeply nested callback functions that become difficult to read and maintain. It was solved by Promises, and subsequently by the async/await syntax which makes async code look synchronous." },
      { question: "How can you optimize an Express route that needs to fetch data from three separate, independent database tables?", answer: "Instead of awaiting them sequentially, which takes the sum of their execution times, use Promise.all() to execute all three database calls concurrently, reducing the total execution time to the longest individual query." },
      { question: "What happens if you run a CPU-intensive while loop inside an Express route?", answer: "Node.js runs on a single-threaded Event Loop. A CPU-intensive synchronous loop will block the event loop, causing the entire Express server to become unresponsive to all other incoming requests until the loop finishes." },
      { question: "What major improvement does Express 5 bring regarding async/await?", answer: "Express 5 natively supports Promises. If an async route handler or middleware throws an error or returns a rejected Promise, Express will automatically catch it and forward it to the error handler, eliminating the need for manual try/catch + next() boilerplate." }
    ],
    practicalTask: {
      scenario: "You need to fetch user profile and user settings simultaneously.",
      task: "Write an async route handler for GET '/profile' that uses Promise.all to call 'db.getProfile()' and 'db.getSettings()', then sends them merged in a JSON response. Include try/catch.",
      solutionCode: `
app.get('/profile', async (req, res, next) => {
  try {
    const [profile, settings] = await Promise.all([
      db.getProfile(),
      db.getSettings()
    ]);
    res.json({ ...profile, settings });
  } catch (err) {
    next(err);
  }
});
      `
    }
  }
];

appendTopics('express', 'Express.js API Design', 'The definitive guide.', topics);
