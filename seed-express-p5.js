import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'scalable-folder-structures',
    title: 'Scalable Folder Structures for Express Applications',
    order: 21,
    content: `
<h1>Scalable Folder Structures for Express Applications</h1>
<p>Unlike opinionated frameworks like NestJS or Ruby on Rails, Express does not enforce a specific directory structure. While this provides immense flexibility, it often leads to "spaghetti code" in large applications if not planned correctly. A scalable folder structure organizes code by feature or domain, rather than by technical role.</p>

<h2>The Problem with MVC-by-Role</h2>
<p>A common beginner mistake is grouping files by their technical role:</p>
<pre>
/controllers
  userController.js
  productController.js
/models
  userModel.js
  productModel.js
/routes
  userRoutes.js
  productRoutes.js
</pre>
<p>As the application grows to hundreds of models, navigating this structure becomes a nightmare. Every time you work on the "user" feature, you must jump between three different distant folders.</p>

<h2>Domain-Driven (Feature-Based) Structure</h2>
<p>A much more scalable approach is to group files by feature or domain. This encapsulates all logic related to a specific entity in one place.</p>
<pre>
/src
  /modules
    /users
      user.model.js
      user.controller.js
      user.routes.js
      user.service.js
      user.validation.js
    /products
      product.model.js
      ...
  /core
    /middleware
      errorHandler.js
      auth.js
    /utils
      logger.js
      db.js
  app.js
  server.js
</pre>

<h2>The Service Layer Pattern</h2>
<p>Notice the inclusion of a <code>.service.js</code> file. In scalable Express apps, you should abstract business logic away from the controller. The Controller's ONLY job is to handle HTTP requests (parsing req, calling service, sending res). The Service's job is to handle business logic and database interactions. This makes your business logic reusable (e.g., calling it from a cron job or CLI script) and easily unit-testable without mocking HTTP objects.</p>

<pre><code class="language-javascript">
// user.controller.js
const userService = require('./user.service');

exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// user.service.js
const User = require('./user.model');

exports.createUser = async (userData) => {
  // Business logic, hash passwords, trigger emails, etc.
  const user = await User.create(userData);
  return user;
};
</code></pre>

<h2>Configuration and Environment Variables</h2>
<p>Keep your configuration centralized. Instead of calling <code>process.env</code> everywhere, create a <code>config.js</code> file that loads, validates, and exports environment variables. This fails fast if an env var is missing during startup.</p>
`,
    interviewQuestions: [
      {
        question: "Why is an MVC-by-role folder structure (grouping all controllers together, all models together) bad for scaling?",
        answer: "As the project grows, it becomes difficult to maintain. Working on a single feature (like 'Users') requires constantly switching contexts between distant folders. It also makes it harder to extract features into microservices later."
      },
      {
        question: "What is a Feature-Based (or Domain-Driven) folder structure?",
        answer: "It is an architecture where files are grouped by the business entity or feature they belong to. For example, a `users` directory would contain user.model.js, user.controller.js, and user.routes.js. This ensures high cohesion."
      },
      {
        question: "What is the purpose of the Service Layer in an Express application?",
        answer: "The Service Layer decouples business logic from HTTP transport logic. Controllers handle the req/res lifecycle, while Services handle database queries and business rules. This makes the logic reusable across different transports (like WebSockets) and much easier to unit test."
      },
      {
        question: "Why should you decouple the app configuration (`app.js`) from the server execution (`server.js`)?",
        answer: "Separating the Express app configuration from the actual `app.listen()` call allows you to export the app instance for testing (e.g., using Supertest) without starting an actual network server and listening on a port."
      },
      {
        question: "How should environment variables be handled in a large Express project?",
        answer: "They should be centralized in a `config/` directory. The config module reads `process.env`, validates required variables (often using a library like Joi or Zod), and exports a configuration object. This ensures the app fails immediately on boot if a critical variable is missing."
      }
    ],
    practicalTask: {
      scenario: "Refactor a monolithic controller.",
      task: "Take an Express route that parses a request, hashes a password, saves to DB, and sends an email. Split it into a Controller and a Service function.",
      solutionCode: `
// user.service.js
const hashPassword = require('../utils/hash');
const User = require('./user.model');
const emailer = require('../utils/emailer');

exports.register = async ({ email, password }) => {
  const hashed = await hashPassword(password);
  const user = await User.create({ email, password: hashed });
  await emailer.sendWelcome(email);
  return user;
};

// user.controller.js
const userService = require('./user.service');

exports.registerUser = async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
      `
    }
  },
  {
    slug: 'express-graphql-integration',
    title: 'Express and GraphQL Integration',
    order: 22,
    content: `
<h1>Express and GraphQL Integration</h1>
<p>While REST is the standard for web APIs, GraphQL provides a powerful alternative by allowing clients to request exactly the data they need. Express serves as an excellent HTTP transport layer for a GraphQL server using tools like <code>apollo-server-express</code> or <code>express-graphql</code>.</p>

<h2>REST vs GraphQL</h2>
<p>In REST, you have multiple endpoints returning fixed data structures (e.g., <code>/users/:id</code>, <code>/posts</code>). In GraphQL, you have a single endpoint (usually <code>/graphql</code>) taking complex query strings. The client specifies the shape of the response.</p>

<h2>Setting up Apollo Server with Express</h2>
<p>Apollo Server is the industry standard for building GraphQL APIs in Node.js. It integrates seamlessly as middleware into an Express app.</p>
<pre><code class="language-javascript">
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// 1. Define your GraphQL Schema
const typeDefs = gql\`
  type Query {
    hello: String
    user(id: ID!): User
  }
  type User {
    id: ID!
    name: String!
    email: String!
  }
\`;

// 2. Define your Resolvers (The logic that fetches the data)
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    user: (_, args) => {
      // Fetch from DB using args.id
      return { id: args.id, name: 'Alice', email: 'alice@test.com' };
    },
  },
};

// 3. Initialize Server
async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  
  await apolloServer.start();
  
  // Attach Apollo middleware to Express
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  app.listen(4000, () => {
    console.log('Server ready at http://localhost:4000/graphql');
  });
}

startServer();
</code></pre>

<h2>Context in GraphQL</h2>
<p>In Express, you use middleware to authenticate users and attach <code>req.user</code>. To pass this authentication data to your GraphQL resolvers, you use the <code>context</code> object in Apollo Server.</p>
<pre><code class="language-javascript">
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Read token from headers, verify, get user
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token);
    // This context object is passed as the 3rd argument to all resolvers
    return { user, db: myDatabaseConnection };
  }
});
</code></pre>

<h2>The N+1 Problem</h2>
<p>A common issue in GraphQL is the N+1 problem, where querying a list of items and their relations results in 1 query for the list, and N queries for the relations. Use <strong>DataLoader</strong> to batch and cache these database requests effectively within the context of a single GraphQL request.</p>
`,
    interviewQuestions: [
      {
        question: "How does GraphQL integrate with an Express application?",
        answer: "GraphQL acts as a middleware on a single route (typically POST /graphql). Packages like apollo-server-express intercept requests to this route, parse the GraphQL query, execute the associated resolvers, and send the response back through the Express response object."
      },
      {
        question: "What is the difference between typeDefs and resolvers in Apollo Server?",
        answer: "typeDefs (Type Definitions) dictate the Schema—the structure, types, and relationships of the data available. Resolvers are the actual Javascript functions that provide the logic to fetch or mutate the data defined in the schema."
      },
      {
        question: "How do you handle authentication in an Express-GraphQL app?",
        answer: "You typically handle auth in standard Express middleware before the GraphQL endpoint, or inside the Apollo Server `context` initialization function. You extract the token from `req.headers`, verify it, and return the `user` object in the context, which makes it available to all resolvers."
      },
      {
        question: "What is the N+1 problem in GraphQL?",
        answer: "It occurs when a query fetches a list of N items, and then a resolver for a nested field triggers an additional database query for each item, resulting in N+1 total queries. It causes severe performance issues."
      },
      {
        question: "How do you solve the N+1 problem in a Node.js GraphQL server?",
        answer: "By using DataLoader. DataLoader batches multiple individual requests for IDs into a single bulk database query (e.g., SELECT * WHERE id IN (...)) and caches the results per request."
      }
    ],
    practicalTask: {
      scenario: "Set up a basic GraphQL endpoint.",
      task: "Write an Express app using apollo-server-express with a single Query 'ping' that returns 'pong'.",
      solutionCode: `
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql\`
  type Query {
    ping: String
  }
\`;

const resolvers = {
  Query: { ping: () => 'pong' }
};

async function start() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });
  
  app.listen(3000, () => console.log('Ready on /graphql'));
}
start();
      `
    }
  },
  {
    slug: 'sse-and-websockets',
    title: 'Server-Sent Events (SSE) and WebSockets in Express',
    order: 23,
    content: `
<h1>Server-Sent Events (SSE) and WebSockets in Express</h1>
<p>Modern applications require real-time capabilities. Polling (client requesting data every few seconds) is inefficient. Express supports two primary patterns for real-time data: Server-Sent Events (SSE) for one-way communication, and WebSockets for full-duplex two-way communication.</p>

<h2>Server-Sent Events (SSE)</h2>
<p>SSE is a standard allowing a server to push data to a web page over a standard HTTP connection. It is unidirectional (Server to Client only) and built directly into Express without extra libraries.</p>
<pre><code class="language-javascript">
app.get('/stream', (req, res) => {
  // 1. Set required headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Tell client to expect stream

  // 2. Send data periodically
  const interval = setInterval(() => {
    const data = JSON.stringify({ time: new Date() });
    // Note the required format: "data: <content>\n\n"
    res.write(\`data: \${data}\\n\\n\`);
  }, 1000);

  // 3. Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});
</code></pre>
<p>On the client side, you consume this using the native <code>EventSource</code> API.</p>

<h2>WebSockets with Socket.io</h2>
<p>For two-way real-time communication (e.g., chat applications, multiplayer games), WebSockets are required. The most popular library in the Node ecosystem is <code>socket.io</code>. Because WebSockets require an upgrade from the HTTP protocol, you must attach Socket.io to the underlying Node HTTP server, not just the Express app.</p>
<pre><code class="language-javascript">
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
// Create pure HTTP server wrapping Express
const server = http.createServer(app);
// Bind Socket.io to the HTTP server
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for custom events from client
  socket.on('chat_message', (msg) => {
    // Broadcast to all connected clients
    io.emit('chat_message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the HTTP server, NOT the express app directly!
server.listen(3000, () => {
  console.log('Listening on *:3000');
});
</code></pre>

<h2>Choosing Between SSE and WebSockets</h2>
<ul>
<li><strong>Use SSE when:</strong> You only need to push data from server to client (e.g., live sports scores, stock ticker, progress bars). It operates over standard HTTP/2 and handles multiplexing automatically.</li>
<li><strong>Use WebSockets when:</strong> You need high-frequency, low-latency communication in BOTH directions (chat apps, gaming).</li>
</ul>
`,
    interviewQuestions: [
      {
        question: "What are Server-Sent Events (SSE)?",
        answer: "SSE is a technology that enables a browser to receive automatic updates from a server via HTTP connection. It is unidirectional (server to client) and uses a text/event-stream content type."
      },
      {
        question: "How do you implement SSE in plain Express?",
        answer: "You set headers `Content-Type: text/event-stream`, `Connection: keep-alive`, and `Cache-Control: no-cache`. Then you use `res.write('data: ' + message + '\\n\\n')` to push messages without closing the connection (`res.end()`)."
      },
      {
        question: "Why do you need to use `http.createServer(app)` when integrating Socket.io with Express?",
        answer: "WebSockets require the HTTP connection to be 'upgraded' to a WebSocket protocol. Express's `app.listen` hides the underlying HTTP server. To bind Socket.io, we need explicit access to that Node.js `http.Server` instance so Socket.io can hook into the 'upgrade' event."
      },
      {
        question: "When would you choose SSE over WebSockets?",
        answer: "When communication is purely one-way (server pushing to client), such as live feeds, notifications, or dashboard updates. SSE is simpler, runs over standard HTTP, and has built-in reconnection logic in the browser's EventSource API."
      },
      {
        question: "How do you handle client disconnects in an Express SSE route?",
        answer: "By listening to the `req.on('close', callback)` event. Inside the callback, you should clear any intervals or event listeners preventing memory leaks, and end the response."
      }
    ],
    practicalTask: {
      scenario: "Create an SSE endpoint for a progress bar.",
      task: "Write an Express route /progress that sends a number from 1 to 100 over 10 seconds using SSE.",
      solutionCode: `
app.get('/progress', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    res.write(\`data: \${JSON.stringify({ progress })}\\n\\n\`);
    
    if (progress >= 100) {
      clearInterval(interval);
      res.end();
    }
  }, 1000);

  req.on('close', () => clearInterval(interval));
});
      `
    }
  },
  {
    slug: 'custom-view-engines',
    title: 'Creating Custom View Engines',
    order: 24,
    content: `
<h1>Creating Custom View Engines</h1>
<p>While Express has robust support for engines like Pug, EJS, and Handlebars, understanding how view engines hook into Express gives you advanced control. You can even write your own view engine for proprietary template syntaxes.</p>

<h2>How Express Views Work</h2>
<p>When you call <code>res.render('index', { name: 'Alice' })</code>, Express looks at the <code>view engine</code> setting to determine the file extension, resolves the file path using the <code>views</code> directory setting, and calls the engine's render function.</p>

<h2>Registering a Custom Engine</h2>
<p>You use <code>app.engine(ext, callback)</code> to register a custom template engine. The callback must have the signature <code>(filePath, options, callback)</code>.</p>

<pre><code class="language-javascript">
const express = require('express');
const fs = require('fs');
const app = express();

// 1. Define the engine function
const myCustomEngine = (filePath, options, callback) => {
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err);
    
    // Convert Buffer to string
    let rendered = content.toString();
    
    // Simple replacement logic: replace {{key}} with options.key
    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        const regex = new RegExp('{{' + key + '}}', 'g');
        rendered = rendered.replace(regex, options[key]);
      }
    }
    
    // Return the rendered HTML to Express
    return callback(null, rendered);
  });
};

// 2. Register the engine for '.myext' files
app.engine('myext', myCustomEngine);

// 3. Set Express configurations
app.set('views', './views'); // specify views directory
app.set('view engine', 'myext'); // set default extension

app.get('/', (req, res) => {
  // Renders ./views/index.myext
  res.render('index', { title: 'Custom Engine', message: 'Hello World!' });
});
</code></pre>

<h2>Why build a custom engine?</h2>
<p>Generally, you shouldn't build one for production HTML rendering, as existing libraries are highly optimized (AST compilation, caching). However, custom engines are perfect for:</p>
<ul>
<li>Rendering dynamic Markdown files directly.</li>
<li>Parsing and injecting env variables into static HTML configurations.</li>
<li>Rendering plain text emails from templates.</li>
</ul>

<h2>View Caching</h2>
<p>In production (<code>NODE_ENV=production</code>), Express caches the path of the view files, but the view engine itself is responsible for caching the parsed template logic. If you build a custom engine, you must implement your own memory caching mechanism to prevent reading the file system on every request.</p>
`,
    interviewQuestions: [
      {
        question: "What happens internally when res.render() is called?",
        answer: "Express determines the absolute path to the view file, checks if the view is cached, reads the file (or uses the cache), and passes the file path and local variables to the registered view engine callback. The engine renders the string and Express sends it with text/html headers."
      },
      {
        question: "How do you register a custom view engine in Express?",
        answer: "By using `app.engine('ext', engineCallback)`. The callback must accept three parameters: `filePath`, `options` (which includes local variables), and a `callback` to return the rendered string or error."
      },
      {
        question: "What does `app.set('view engine', 'pug')` do?",
        answer: "It sets the default file extension for views. If you call `res.render('index')` without an extension, Express will automatically look for `index.pug` and use the Pug engine."
      },
      {
        question: "How is view caching handled in Express?",
        answer: "Express only caches the resolved file path of the view in memory when NODE_ENV is set to production. The actual template compilation caching must be implemented by the view engine itself."
      },
      {
        question: "Give a use case for creating a custom view engine.",
        answer: "A good use case is rendering server-side dynamic markdown files into HTML on the fly, or populating static configuration XML/JSON templates with environment-specific variables before serving."
      }
    ],
    practicalTask: {
      scenario: "Create a Markdown view engine.",
      task: "Register an engine for '.md' files that reads the markdown file, replaces a {{name}} variable, and returns plain text.",
      solutionCode: `
const fs = require('fs');

app.engine('md', (filePath, options, callback) => {
  fs.readFile(filePath, 'utf8', (err, str) => {
    if (err) return callback(err);
    const rendered = str.replace('{{name}}', options.name);
    callback(null, rendered);
  });
});

app.set('view engine', 'md');

app.get('/', (req, res) => {
  res.render('hello', { name: 'Express User' });
});
      `
    }
  },
  {
    slug: 'idempotent-rest-apis',
    title: 'Building Idempotent REST APIs',
    order: 25,
    content: `
<h1>Building Idempotent REST APIs</h1>
<p>An API endpoint is considered <em>idempotent</em> if making multiple identical requests has the same effect on the server state as making a single request. This is a critical concept for robust, fault-tolerant distributed systems, especially in payment processing or order creation.</p>

<h2>HTTP Methods and Idempotency</h2>
<ul>
<li><strong>GET, HEAD, OPTIONS:</strong> Naturally idempotent and "safe" (do not modify state).</li>
<li><strong>PUT, DELETE:</strong> Must be idempotent. Deleting a user twice should result in the user being gone, with no additional side effects. Updating a user's name to "Alice" ten times leaves the name as "Alice".</li>
<li><strong>POST:</strong> Generally NOT idempotent. Submitting an order POST request twice usually creates two orders.</li>
</ul>

<h2>The Problem with POST</h2>
<p>If a client sends a POST request to create an order, but the network drops the response, the client doesn't know if the order succeeded. If they retry, they might be charged twice. To fix this, we implement <strong>Idempotency Keys</strong>.</p>

<h2>Implementing Idempotency Keys in Express</h2>
<p>The client generates a unique UUID (Idempotency-Key) and sends it in the HTTP headers. The server stores the result of the request against this key. If the client retries with the same key, the server intercepts it and returns the cached response instead of reprocessing the transaction.</p>

<pre><code class="language-javascript">
const express = require('express');
const app = express();
app.use(express.json());

// In a real app, this MUST be a distributed cache like Redis
const idempotencyCache = new Map();

const idempotencyMiddleware = (req, res, next) => {
  if (req.method !== 'POST') return next();

  const key = req.headers['x-idempotency-key'];
  if (!key) {
    return res.status(400).json({ error: 'Idempotency key required' });
  }

  if (idempotencyCache.has(key)) {
    // Return cached response instantly
    const cachedResponse = idempotencyCache.get(key);
    return res.status(200).json(cachedResponse);
  }

  // Intercept res.json to cache the response before sending
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    idempotencyCache.set(key, body);
    originalJson(body);
  };

  next();
};

app.post('/api/payments', idempotencyMiddleware, (req, res) => {
  // Heavy payment logic here
  // If retried with same key, this block NEVER executes again
  const transactionId = Math.random().toString(36).substring(7);
  res.json({ success: true, transactionId, amount: req.body.amount });
});
</code></pre>

<h2>Database Level Idempotency</h2>
<p>Beyond caching responses, you should enforce idempotency at the database level using unique constraints. If processing a webhook, use the webhook's event ID as a unique primary key in your database to ensure you never process the same event twice.</p>
`,
    interviewQuestions: [
      {
        question: "Define Idempotency in the context of REST APIs.",
        answer: "An idempotent operation is one that can be applied multiple times without changing the result beyond the initial application. No matter how many times you call an idempotent endpoint, the server state remains the same as if you called it once."
      },
      {
        question: "Which HTTP methods are required to be idempotent by the HTTP specification?",
        answer: "GET, HEAD, OPTIONS, TRACE (Safe methods). And PUT, DELETE (State-modifying, but idempotent). POST is explicitly NOT idempotent by default."
      },
      {
        question: "How do you make a POST request idempotent (e.g., creating a payment)?",
        answer: "By requiring the client to send a unique 'Idempotency-Key' header. The server stores the response associated with this key in a cache/DB. If a retry occurs with the same key, the server returns the cached response instead of processing the payment again."
      },
      {
        question: "Why intercept res.json() when building an idempotency middleware?",
        answer: "Because we need to capture the exact payload that the route handler generates so we can save it to our Redis/memory cache. By overriding res.json, we can intercept the body right before it gets sent to the client."
      },
      {
        question: "What happens if a request with an Idempotency-Key is received, but the previous request with that key is still processing?",
        answer: "This is a race condition. The middleware should ideally place a lock on that key (e.g., status: 'processing'). If a second request hits the lock, it should return a 409 Conflict or a 425 Too Early status, telling the client to back off and wait."
      }
    ],
    practicalTask: {
      scenario: "Implement an Idempotency mechanism.",
      task: "Create a route /charge that requires an 'Idempotency-Key' header. Return a random transaction ID. On duplicate requests, return the exact same transaction ID.",
      solutionCode: `
const cache = new Map();

app.post('/charge', (req, res) => {
  const key = req.header('Idempotency-Key');
  if (!key) return res.status(400).send('Missing key');

  if (cache.has(key)) {
    return res.json(cache.get(key));
  }

  const txId = 'TXN_' + Date.now();
  const responseData = { success: true, txId };
  
  cache.set(key, responseData);
  res.json(responseData);
});
      `
    }
  }
];

appendTopics('express', 'Express.js API Design', 'The definitive guide.', topics);
