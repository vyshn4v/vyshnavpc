import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGODB_DB_NAME
    });
    console.log("Connected to MongoDB for Seeding Express.js.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const getDocsModel = () => {
  if (mongoose.models.Docs) {
    return mongoose.models.Docs;
  }
  const DocsSchema = new mongoose.Schema({
    technology: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    topics: [{
      slug: { type: String, required: true },
      title: { type: String, required: true },
      order: { type: Number, required: true },
      content: { type: String, required: true }
    }]
  });
  return mongoose.model("Docs", DocsSchema);
};

const expressDoc = {
  technology: "express",
  title: "Express.js Enterprise Architecture",
  description: "Advanced deep dive into routing patterns, security middlewares, and MVC architectures.",
  topics: [
    {
      slug: "routing",
      title: "1. Advanced Routing",
      order: 1,
      content: `
        <h2>Advanced Routing</h2>
        <p>Routing refers to how an application's endpoints (URIs) respond to client requests. For enterprise applications, writing routes directly in the main server file creates spaghetti code. You must modularize them.</p>
        
        <h3>The express.Router</h3>
        <p>Use the <code>express.Router</code> class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; often referred to as a "mini-app".</p>

        <pre><code class="language-javascript">
// birds.js
const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route
router.get('/', (req, res) => {
  res.send('Birds home page');
});

// define the about route
router.get('/about', (req, res) => {
  res.send('About birds');
});

module.exports = router;

// app.js
const birds = require('./birds');
app.use('/birds', birds);
        </code></pre>
      `
    },
    {
      slug: "middleware",
      title: "2. Custom Middleware",
      order: 2,
      content: `
        <h2>Custom Middleware</h2>
        <p>Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle. The next middleware function is commonly denoted by a variable named <code>next</code>.</p>
        
        <h3>Writing a Logger Middleware</h3>
        <pre><code class="language-javascript">
const myLogger = function (req, res, next) {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.originalUrl}\`);
  next(); // Pass control to the next middleware
};

app.use(myLogger);
        </code></pre>

        <h3>Writing an Authentication Middleware</h3>
        <p>Middleware is perfect for intercepting requests and rejecting them before they hit your database controllers.</p>
        <pre><code class="language-javascript">
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }
  
  jwt.verify(token, process.env.SECRET, (err, decodedUser) => {
    if (err) return res.status(403).json({ error: 'Forbidden. Invalid token.' });
    req.user = decodedUser; // Inject the user object into the request!
    next();
  });
};

// Protect a single route
app.post('/api/posts', requireAuth, createPostController);
        </code></pre>
      `
    },
    {
      slug: "error-handling",
      title: "3. Global Error Handling",
      order: 3,
      content: `
        <h2>Global Error Handling</h2>
        <p>Error Handling Middleware functions are defined in the same way as other middleware functions, except they have four arguments instead of three: <code>(err, req, res, next)</code>.</p>
        
        <h3>The Async/Await Problem</h3>
        <p>Express 4 does NOT automatically catch errors thrown inside <code>async</code> functions. If a database query throws an error inside an async route, the Node server will crash (Unhandled Promise Rejection). You must pass the error to <code>next(err)</code>.</p>

        <h3>The Ultimate Async Catch Wrapper</h3>
        <p>Instead of wrapping every single controller in a <code>try/catch</code> block, write a wrapper function.</p>
        <pre><code class="language-javascript">
// catchAsync.js
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// userController.js
const catchAsync = require('./catchAsync');

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id); // If this throws, it goes directly to the global error handler!
  if (!user) {
    return next(new AppError('No user found with that ID', 404)); // Trigger global error handler
  }
  res.status(200).json({ data: user });
});

// app.js - Global Error Handler (Put this at the VERY end of all routes)
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});
        </code></pre>
      `
    },
    {
      slug: "security",
      title: "4. Security Best Practices",
      order: 4,
      content: `
        <h2>Security Best Practices</h2>
        <p>Express.js is unopinionated. It doesn't come with security headers or rate limiters out of the box. You must add them.</p>

        <h3>1. Helmet (HTTP Headers)</h3>
        <p>Helmet helps secure your Express apps by setting various HTTP headers (XSS filters, Content Security Policy, hiding the X-Powered-By header).</p>
        <pre><code class="language-bash">npm install helmet</code></pre>
        <pre><code class="language-javascript">
const helmet = require('helmet');
app.use(helmet());
        </code></pre>

        <h3>2. Rate Limiting</h3>
        <p>Use <code>express-rate-limit</code> to protect your API against brute-force attacks and DDOS.</p>
        <pre><code class="language-bash">npm install express-rate-limit</code></pre>
        <pre><code class="language-javascript">
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again in an hour!'
});

// Apply to all requests
app.use('/api', limiter);
        </code></pre>

        <h3>3. Data Sanitization (NoSQL Injection)</h3>
        <p>If you use MongoDB, attackers can pass operator injection queries like <code>{ "$gt": "" }</code> into your email/password fields to bypass authentication. Use <code>express-mongo-sanitize</code>.</p>
        <pre><code class="language-javascript">
const mongoSanitize = require('express-mongo-sanitize');

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // Removes all dollar signs ($) from req.body, req.query, and req.params
        </code></pre>
      `
    },
    {
      slug: "mvc-architecture",
      title: "5. MVC Enterprise Architecture",
      order: 5,
      content: `
        <h2>MVC Enterprise Architecture</h2>
        <p>As an Express app scales, you must separate concerns into the Model-View-Controller (MVC) pattern.</p>

        <h3>1. The Router (The Switchboard)</h3>
        <p>The router only delegates the request to the correct controller.</p>
        <pre><code class="language-javascript">
// routes/tourRoutes.js
router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect, authController.restrictTo('admin'), tourController.createTour);
        </code></pre>

        <h3>2. The Controller (The Manager)</h3>
        <p>The controller receives the HTTP request, extracts the data (req.body, req.params), passes it to a Service/Model, and formats the HTTP response (res.json).</p>
        <pre><code class="language-javascript">
// controllers/tourController.js
exports.createTour = async (req, res, next) => {
  // Delegate business logic to the Model/Service
  const newTour = await Tour.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { tour: newTour }
  });
};
        </code></pre>

        <h3>3. The Model (The Business Logic & Data)</h3>
        <p>The Mongoose Schema defines the data shape, validates the data, and contains database lifecycle hooks (pre/post save middlewares).</p>
        <pre><code class="language-javascript">
// models/tourModel.js
const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: String
});

// Document Middleware: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
        </code></pre>
      `
    }
  ]
};

const run = async () => {
  await connectDb();
  const Docs = getDocsModel();
  await Docs.findOneAndUpdate(
    { technology: expressDoc.technology },
    expressDoc,
    { upsert: true, new: true }
  );
  console.log("✅ Comprehensive Express.js docs seeded successfully!");
  process.exit(0);
};

run();
