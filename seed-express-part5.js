import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "input-validation",
    title: "21. Input Validation and Sanitization",
    order: 21,
    content: "<h2>Data Integrity</h2><p>`express-validator` is a set of Express middleware that wraps validator.js, providing robust validation and sanitization.</p>",
    interviewQuestions: [
      { question: "Why is input validation necessary?", answer: "To prevent bad data from crashing the app, prevent injection attacks, and ensure data integrity in the database." },
      { question: "How does express-validator work?", answer: "It provides middleware functions that check req.body, req.query, or req.params and populates a validation result object." }
    ],
    practicalTask: {
      scenario: "Validate an email field.",
      task: "Use express-validator to ensure an email is valid.",
      solutionCode: "const { body, validationResult } = require('express-validator');\napp.post('/user', body('email').isEmail(), (req, res) => {\n  const errors = validationResult(req);\n  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });\n  res.send('Valid');\n});"
    }
  },
  {
    slug: "authentication-passport",
    title: "22. Authentication Strategies (Passport.js)",
    order: 22,
    content: "<h2>Passport Middleware</h2><p>Passport is authentication middleware for Node.js. It supports various strategies: local, OAuth, JWT, etc.</p>",
    interviewQuestions: [
      { question: "What is a Strategy in Passport.js?", answer: "A strategy is an authentication mechanism, like LocalStrategy (username/password) or GoogleStrategy (OAuth)." },
      { question: "How does Passport integrate with Express?", answer: "Via `passport.initialize()` and `passport.session()` middleware, which attach the authenticated user to `req.user`." }
    ],
    practicalTask: {
      scenario: "Initialize Passport.",
      task: "Add Passport initialization middleware to an Express app.",
      solutionCode: "const passport = require('passport');\napp.use(passport.initialize());\napp.use(passport.session());"
    }
  },
  {
    slug: "jwt-implementation",
    title: "23. JWT (JSON Web Tokens)",
    order: 23,
    content: "<h2>Stateless Auth</h2><p>JWTs are compact, URL-safe tokens used for stateless authentication. In Express, you verify the token in middleware.</p>",
    interviewQuestions: [
      { question: "What is stateless authentication?", answer: "Authentication where the server doesn't store session data. The client holds a token (like a JWT) which contains all necessary identity data." },
      { question: "How do you protect a route using JWT?", answer: "By writing a middleware that reads the token from the Authorization header, verifies its signature, and attaches the decoded payload to req.user." }
    ],
    practicalTask: {
      scenario: "Protect a route with JWT.",
      task: "Create a middleware that verifies a JWT.",
      solutionCode: "const jwt = require('jsonwebtoken');\nconst verify = (req, res, next) => {\n  const token = req.headers['authorization'];\n  if (!token) return res.status(403).send('Token required');\n  try {\n    req.user = jwt.verify(token.split(' ')[1], 'secret');\n    next();\n  } catch (err) { res.status(401).send('Invalid'); }\n};\napp.get('/protected', verify, (req, res) => res.send('Secret'));"
    }
  },
  {
    slug: "securing-headers",
    title: "24. Securing Headers (Helmet)",
    order: 24,
    content: "<h2>HTTP Security</h2><p>Helmet helps secure Express apps by setting various HTTP headers. It mitigates XSS, Clickjacking, and disables the X-Powered-By header.</p>",
    interviewQuestions: [
      { question: "What is the X-Powered-By header and why remove it?", answer: "It reveals the framework running the server (e.g., Express). Removing it reduces information leakage to attackers." },
      { question: "What does the X-Frame-Options header do?", answer: "It prevents the site from being rendered inside an iframe, protecting against clickjacking attacks." }
    ],
    practicalTask: {
      scenario: "Disable the Express identifier.",
      task: "Disable the 'x-powered-by' header without using Helmet.",
      solutionCode: "app.disable('x-powered-by');"
    }
  },
  {
    slug: "rate-limiting",
    title: "25. Rate Limiting and DoS Protection",
    order: 25,
    content: "<h2>Protecting APIs</h2><p>Rate limiting restricts the number of requests a client can make within a time frame, preventing brute-force and basic DoS attacks.</p>",
    interviewQuestions: [
      { question: "Why is rate limiting important?", answer: "It protects the server from being overwhelmed by too many requests (DoS) and prevents brute-forcing of credentials." },
      { question: "How does express-rate-limit work?", answer: "It tracks requests (usually by IP) in memory or a store (like Redis) and blocks requests that exceed the defined threshold." }
    ],
    practicalTask: {
      scenario: "Limit API requests.",
      task: "Apply a rate limiter of 100 requests per 15 minutes.",
      solutionCode: "const rateLimit = require('express-rate-limit');\nconst limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });\napp.use(limiter);"
    }
  }
];

appendTopics("express", "Express.js API Design", "The definitive guide.", topics).then(() => console.log('Part 5 seeded!'));
