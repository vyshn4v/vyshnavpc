import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'express-advanced-routing',
    title: 'Advanced Routing and Controllers',
    order: 6,
    content: `
## Advanced Routing and Controllers

As applications scale, putting all route logic into a single file becomes unmanageable. Advanced routing in Express involves breaking down route definitions into nested routers and separating the business logic into controllers.

### Nested Routers
You can nest routers within other routers to create a hierarchical URI structure. This is extremely useful for complex APIs.

\`\`\`javascript
// commentsRouter.js
const express = require('express');
// mergeParams: true is CRITICAL if you want to access params from the parent router
const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => {
  // Can access req.params.postId because of mergeParams
  res.send(\`Getting comments for post \${req.params.postId}\`);
});

module.exports = router;

// postsRouter.js
const express = require('express');
const commentsRouter = require('./commentsRouter');
const router = express.Router();

router.get('/', (req, res) => res.send('All posts'));

// Nest the comments router
router.use('/:postId/comments', commentsRouter);

module.exports = router;
\`\`\`

### The Controller Pattern
A Controller is a module that exports functions to handle specific requests. This separates the routing logic (which HTTP method and path) from the business logic (what actually happens).

\`\`\`javascript
// controllers/productController.js
exports.getAllProducts = async (req, res) => {
  // Logic to fetch products
  res.json({ status: 'success', data: [] });
};

exports.createProduct = async (req, res) => {
  // Logic to create a product
  res.status(201).json({ status: 'success', data: {} });
};

// routes/productRoutes.js
const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router.route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

module.exports = router;
\`\`\`

### Dependency Injection in Controllers
For highly testable applications, you might pass services into your controllers rather than importing them directly. This allows you to easily mock the services during unit testing.

\`\`\`javascript
// Controller factory
module.exports = function makeProductController(productService) {
  return {
    getAllProducts: async (req, res) => {
      const products = await productService.findAll();
      res.json(products);
    }
  };
};
\`\`\`

### Versioning APIs
A common advanced routing requirement is API versioning. This can be done via URL routing.

\`\`\`javascript
const apiV1Router = require('./routes/v1');
const apiV2Router = require('./routes/v2');

app.use('/api/v1', apiV1Router);
app.use('/api/v2', apiV2Router);
\`\`\`
`,
    interviewQuestions: [
      { question: "Why would you use mergeParams: true when creating an Express Router?", answer: "By default, an Express router does not have access to route parameters defined in the parent router. Setting mergeParams: true allows the child router to access parameters from the parent (e.g., getting :postId inside the nested /comments router)." },
      { question: "What is the primary benefit of the Controller pattern?", answer: "It separates the routing configuration (HTTP methods and URIs) from the business logic. This makes the code much more organized, readable, and easier to test in isolation." },
      { question: "How do you implement API versioning in Express?", answer: "The most straightforward way is URL-based versioning, where you create separate router instances for each version and mount them on distinct paths like app.use('/api/v1', routerV1) and app.use('/api/v2', routerV2)." },
      { question: "Can a single route handler function be used across multiple routes?", answer: "Yes, because a controller/handler is just a function taking (req, res, next), it can be imported and attached to as many different routes or routers as necessary." },
      { question: "What is Dependency Injection in the context of Express controllers?", answer: "It's a pattern where the controller doesn't directly import its dependencies (like a database service). Instead, the dependencies are passed to the controller (e.g., via a factory function), making it easier to swap implementations or mock them for testing." }
    ],
    practicalTask: {
      scenario: "Create a nested routing structure for authors and their books.",
      task: "Create an authorRouter and a bookRouter. The bookRouter should be nested inside authorRouter at '/:authorId/books'. The bookRouter must respond to GET '/' with the authorId.",
      solutionCode: `
const express = require('express');

const bookRouter = express.Router({ mergeParams: true });
bookRouter.get('/', (req, res) => {
  res.json({ authorId: req.params.authorId, books: [] });
});

const authorRouter = express.Router();
authorRouter.use('/:authorId/books', bookRouter);
      `
    }
  },
  {
    slug: 'express-template-engines',
    title: 'Template Engines and SSR',
    order: 7,
    content: `
## Template Engines and Server-Side Rendering (SSR)

While Express is frequently used to build JSON APIs for Single Page Applications (SPAs), it is also fully capable of Server-Side Rendering (SSR) HTML pages using Template Engines.

### What is a Template Engine?
A template engine allows you to use static template files in your application. At runtime, the template engine replaces variables in a template file with actual values, and transforms the template into an HTML file sent to the client.

Popular engines include:
- **Pug** (formerly Jade): Indentation-based, highly concise.
- **EJS** (Embedded JavaScript): Looks like standard HTML with embedded \`<% %>\` tags.
- **Handlebars** (\`hbs\`): Logic-less templates using \`{{ }}\` syntax.

### Configuring a View Engine
To use a template engine, you must configure two application settings: \`views\` (the directory where template files are located) and \`view engine\` (the engine to use).

\`\`\`javascript
const express = require('express');
const path = require('path');
const app = express();

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set the view engine to EJS
app.set('view engine', 'ejs');
\`\`\`

### Rendering a View
Instead of \`res.send()\` or \`res.json()\`, you use \`res.render(view_name, locals_object)\`.

\`\`\`javascript
// Route handler
app.get('/profile', (req, res) => {
  const user = { name: 'Alice', age: 28 };
  // Renders views/profile.ejs, passing the user object
  res.render('profile', { user: user });
});
\`\`\`

### Example: EJS Template
Inside \`views/profile.ejs\`:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>User Profile</title>
</head>
<body>
  <h1>Profile of <%= user.name %></h1>
  <% if (user.age >= 18) { %>
    <p>Status: Adult</p>
  <% } else { %>
    <p>Status: Minor</p>
  <% } %>
</body>
</html>
\`\`\`

### Passing Global Variables to Views
If you have data that needs to be accessible in *every* view (like the current logged-in user or a CSRF token), you can attach it to \`res.locals\` via middleware.

\`\`\`javascript
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // Assuming req.user is set by auth middleware
  res.locals.siteName = "My Awesome App";
  next();
});
\`\`\`
`,
    interviewQuestions: [
      { question: "What is the purpose of a Template Engine in Express?", answer: "A template engine generates HTML dynamically on the server side by combining a static template file with runtime data (variables/objects) before sending the final HTML string to the client." },
      { question: "How do you configure Express to use EJS?", answer: "You use app.set('view engine', 'ejs'). Optionally, you can specify the directory using app.set('views', path.join(__dirname, 'views'))." },
      { question: "What is the difference between res.send() and res.render()?", answer: "res.send() sends basic data (strings, buffers, objects). res.render() compiles a template file using the configured view engine and sends the resulting HTML string." },
      { question: "What is res.locals used for?", answer: "res.locals is an object that contains response local variables scoped to the request. It is available only to the view(s) rendered during that request/response cycle. It's useful for exposing request-level data like user session info to all templates." },
      { question: "Name three popular template engines compatible with Express.", answer: "Pug (Jade), EJS, and Handlebars (hbs)." }
    ],
    practicalTask: {
      scenario: "You need to render a list of products using EJS.",
      task: "Configure Express to use EJS. Create a route GET '/products' that renders a 'products' view and passes an array of product objects (name, price) to it.",
      solutionCode: `
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/products', (req, res) => {
  const products = [
    { name: 'Laptop', price: 999 },
    { name: 'Mouse', price: 25 }
  ];
  res.render('products', { products });
});
      `
    }
  },
  {
    slug: 'express-validation-sanitization',
    title: 'Request Validation and Sanitization',
    order: 8,
    content: `
## Request Validation and Sanitization

Never trust user input. Validation ensures the incoming data meets your application's requirements (e.g., email format, password length), while sanitization cleans the data (e.g., trimming whitespace, escaping HTML) to prevent errors and injection attacks.

### Why Validate at the Route Level?
Validating data at the route/controller level prevents malformed data from ever reaching your database or core business logic, saving resources and preventing hard-to-debug database errors.

### Using \`express-validator\`
The most robust tool for validation in Express is \`express-validator\`, which wraps the popular \`validator.js\` library into Express middleware.

\`\`\`bash
npm install express-validator
\`\`\`

### Basic Validation Example
You define validation chains as middleware arrays, followed by a check for validation errors.

\`\`\`javascript
const { body, validationResult } = require('express-validator');

app.post('/register', [
  // Validation chains
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
], (req, res) => {
  // Check results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Proceed with registration
  res.send('Registration successful');
});
\`\`\`

### Sanitization
Sanitization modifies the input data. You can chain sanitization methods directly onto your validation chains.

\`\`\`javascript
app.post('/profile', [
  body('username')
    .trim()                 // removes whitespace
    .escape()               // replaces <, >, &, ', " and / with HTML entities
    .isLength({ min: 3 }),
  body('age')
    .toInt()                // converts string to integer
    .isInt({ min: 18 })
], (req, res) => {
  // Check errors...
});
\`\`\`

### Reusable Validation Middleware
Writing \`validationResult\` checks in every controller is repetitive. A common pattern is creating a reusable validation middleware.

\`\`\`javascript
const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// Usage:
app.post('/login', validate([
  body('email').isEmail(),
  body('password').notEmpty()
]), authController.login);
\`\`\`

### Joi Validation
Alternatively, many developers prefer schema-based validation libraries like **Joi** or **Zod**. You can create a middleware that validates \`req.body\` against a Joi schema.
`,
    interviewQuestions: [
      { question: "What is the difference between validation and sanitization?", answer: "Validation checks if the input meets specific criteria (e.g., is it an email? is it > 5 chars?). Sanitization modifies the input to ensure it is safe or formatted correctly (e.g., trimming spaces, escaping HTML, converting strings to numbers)." },
      { question: "Why should you validate input in Express if you already validate on the frontend?", answer: "Frontend validation is for UX; it can be easily bypassed by attackers using tools like Postman or cURL. Backend validation is a mandatory security measure to protect your database and application logic." },
      { question: "What is express-validator?", answer: "It is a set of Express.js middlewares that wraps validator.js, providing robust methods to validate and sanitize string inputs on the req.body, req.query, or req.params." },
      { question: "What does the escape() sanitizer do?", answer: "The escape() sanitizer replaces potentially dangerous HTML characters (like <, >, &, ', \") with their corresponding HTML entities, helping to prevent Cross-Site Scripting (XSS) attacks." },
      { question: "How can you validate an array of objects in req.body using express-validator?", answer: "You can use wildcard notation. For example, body('items.*.name').isString() will validate the 'name' property of every object inside the 'items' array." }
    ],
    practicalTask: {
      scenario: "Implement strict validation for a user creation endpoint.",
      task: "Use express-validator to validate a POST to '/users'. 'username' must be alphanumeric and trimmed. 'age' must be an integer converted from string. Handle validationResult.",
      solutionCode: `
const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();
app.use(express.json());

app.post('/users', [
  body('username').trim().isAlphanumeric(),
  body('age').toInt().isInt()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  res.json({ message: 'Valid!', data: req.body });
});
      `
    }
  },
  {
    slug: 'express-auth-sessions',
    title: 'Authentication and Session Management',
    order: 9,
    content: `
## Authentication and Session Management

Authentication is verifying *who* a user is. Session management maintains that identity across multiple stateless HTTP requests.

### Stateful vs Stateless Authentication
- **Stateful (Sessions):** The server creates a session ID, stores it in memory or a database, and sends it to the client via a Cookie. The client sends the cookie on subsequent requests.
- **Stateless (JWT):** The server signs a JSON Web Token (JWT) containing user data and sends it to the client. The client stores it (localStorage or HTTP-only Cookie) and sends it via the Authorization header.

### Session-based Auth with \`express-session\`
For traditional web apps (SSR), \`express-session\` is the standard.

\`\`\`javascript
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: 'my_super_secret_key', // Used to sign the session ID cookie
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Persist sessions in DB
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true requires HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.post('/login', (req, res) => {
  // Verify credentials...
  req.session.userId = user.id; // Attach user to session
  res.send('Logged in');
});
\`\`\`

### Token-based Auth with JWT
For APIs and SPAs, JWTs are preferred. Express does not have built-in JWT support; you use the \`jsonwebtoken\` package.

**1. Generating a Token:**
\`\`\`javascript
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
  // Verify credentials...
  const token = jwt.sign({ id: user.id }, 'jwt_secret', { expiresIn: '1h' });
  res.json({ token });
});
\`\`\`

**2. Protecting Routes (Auth Middleware):**
You create a middleware to verify the token before allowing access to a route.

\`\`\`javascript
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, 'jwt_secret');
    req.user = payload; // Attach payload to request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid Token' });
  }
};

app.get('/dashboard', requireAuth, (req, res) => {
  res.send(\`Welcome user \${req.user.id}\`);
});
\`\`\`

### Passport.js
For complex authentication strategies (OAuth with Google/Facebook, SAML, etc.), **Passport.js** is the most popular authentication middleware for Node.js. It abstracts away the complexities of different login providers into a uniform API.
`,
    interviewQuestions: [
      { question: "What is the difference between Stateful (Session) and Stateless (JWT) authentication?", answer: "In Stateful auth, the server stores session data in memory or a database, returning only a session ID to the client. In Stateless auth (JWT), the server stores no state; the token itself contains all necessary verified data (payload) to authenticate the user." },
      { question: "What is express-session and what does the 'secret' option do?", answer: "express-session is a middleware that manages session data. The 'secret' option is a string used to compute a hash to sign the session ID cookie, preventing clients from tampering with the session ID." },
      { question: "Why shouldn't you use the default MemoryStore for express-session in production?", answer: "MemoryStore stores sessions in the Node.js process memory. It causes memory leaks, doesn't scale across multiple server instances (load balancing), and all sessions are lost if the server restarts. A database store (like Redis or MongoDB) should be used." },
      { question: "How do you protect a route using JWTs in Express?", answer: "By creating a middleware that reads the Authorization header, extracts the Bearer token, uses jwt.verify() to validate the signature and expiration, and if valid, attaches the decoded payload to req.user before calling next()." },
      { question: "What is Passport.js?", answer: "Passport is authentication middleware for Node.js. It provides over 500 'strategies' (plugins) to handle different authentication mechanisms like local username/password, OAuth (Google, Twitter), and JWTs." }
    ],
    practicalTask: {
      scenario: "Implement JWT-based authorization middleware.",
      task: "Write an Express middleware called 'verifyToken' that extracts a token from the 'Authorization: Bearer <token>' header. Use jsonwebtoken to verify it against 'SECRET'. If valid, set req.userId and call next().",
      solutionCode: `
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ error: 'No token' });
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'SECRET', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.userId = decoded.id;
    next();
  });
};
      `
    }
  },
  {
    slug: 'express-security-best-practices',
    title: 'Security Best Practices in Express',
    order: 10,
    content: `
## Security Best Practices in Express

Node.js and Express are secure by default, but standard web application vulnerabilities (like XSS, CSRF, and SQL Injection) still apply. You must take explicit steps to secure an Express application.

### 1. HTTP Security Headers with Helmet
The \`helmet\` package is a collection of middleware functions that set various HTTP headers to secure your app (e.g., hiding the \`X-Powered-By\` header, setting Content Security Policies).

\`\`\`javascript
const helmet = require('helmet');
app.use(helmet()); // Enables 11 security-focused middleware by default
\`\`\`

### 2. Rate Limiting
To protect against Brute Force attacks and Denial of Service (DoS), use \`express-rate-limit\` to restrict the number of requests a single IP can make.

\`\`\`javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply to all requests
app.use(limiter);
// Or apply to specific routes like login: app.use('/login', loginLimiter);
\`\`\`

### 3. Data Sanitization (NoSQL Injection & XSS)
If you use MongoDB, attackers can pass objects instead of strings in the body to perform NoSQL injection. Use \`express-mongo-sanitize\`.
To prevent Cross-Site Scripting (XSS), use \`xss-clean\`.

\`\`\`javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
\`\`\`

### 4. Cross-Origin Resource Sharing (CORS)
If your API is accessed from a different domain (e.g., frontend on \`localhost:3000\`, API on \`localhost:5000\`), you must configure CORS properly. Never use a wildcard \`*\` in production for authenticated routes.

\`\`\`javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://mytrustedfrontend.com',
  credentials: true // Allows cookies to be sent with cross-origin requests
}));
\`\`\`

### 5. Parameter Pollution
HTTP Parameter Pollution occurs when the same query parameter is sent multiple times (e.g., \`?sort=price&sort=name\`). This can crash Express or bypass validation. Use \`hpp\`.

\`\`\`javascript
const hpp = require('hpp');
app.use(hpp()); // Clears duplicate parameters, keeping only the last one
\`\`\`

### 6. Avoid Event Loop Blocking
As mentioned previously, never run heavy synchronous operations (like \`bcrypt.hashSync()\`) on the main thread, as it blocks the server for all users. Always use the asynchronous versions (\`bcrypt.hash()\`).
`,
    interviewQuestions: [
      { question: "What does the Helmet middleware do in an Express application?", answer: "Helmet helps secure Express apps by setting various HTTP headers. For example, it removes the X-Powered-By header (which reveals the server is running Express), sets frameguard to prevent Clickjacking, and configures Content Security Policy (CSP)." },
      { question: "How do you protect an Express API from brute-force login attacks?", answer: "By implementing rate limiting, typically using the 'express-rate-limit' package. You apply it to the login route to restrict a specific IP address to a maximum number of attempts within a specific time window." },
      { question: "What is NoSQL Injection and how can you prevent it in an Express/MongoDB app?", answer: "NoSQL injection occurs when an attacker passes a MongoDB operator object (like {$gt: ''}) instead of a string value, tricking the DB into evaluating it as true. It is prevented by using middleware like 'express-mongo-sanitize' which strips out keys starting with '$' or '.' from req.body, req.query, and req.params." },
      { question: "Why should you never use the synchronous versions of cryptography libraries (e.g., bcrypt.hashSync) in Express routes?", answer: "Because Node.js is single-threaded. Synchronous cryptographic operations are highly CPU-intensive and will block the Event Loop. While the hash is being calculated, the server cannot respond to any other incoming requests." },
      { question: "What is CORS and how do you configure it securely in Express?", answer: "Cross-Origin Resource Sharing (CORS) is a browser security feature that restricts cross-origin HTTP requests. In Express, you use the 'cors' middleware. For security, you should specify an exact 'origin' (like your frontend's URL) instead of allowing all origins ('*')." }
    ],
    practicalTask: {
      scenario: "Secure an existing Express application.",
      task: "Write the code to integrate 'helmet' for security headers and 'express-rate-limit' to restrict all API routes to 50 requests per 10 minutes.",
      solutionCode: `
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Set security headers
app.use(helmet());

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: 'Too many requests.'
});
app.use('/api', limiter);
      `
    }
  }
];

appendTopics('express', 'Express.js API Design', 'The definitive guide.', topics);
