import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "router-instances",
    title: "6. Router and App Instances",
    order: 6,
    content: "<h2>Express Router</h2><p>A router object is an isolated instance of middleware and routes. You can think of it as a 'mini-application,' capable only of performing middleware and routing functions.</p><p>Every Express application has a built-in app router.</p>",
    interviewQuestions: [
      { question: "What is express.Router()?", answer: "It creates a modular, mountable route handler. It behaves like a mini Express application to help organize routes." },
      { question: "Why should we use a Router instance?", answer: "It allows breaking down a large application into modular, manageable files, improving code maintainability." }
    ],
    practicalTask: {
      scenario: "Organize API endpoints.",
      task: "Create a router for '/api/v1' and mount it on the main app.",
      solutionCode: "const router = express.Router();\nrouter.get('/status', (req, res) => res.send('OK'));\napp.use('/api/v1', router);"
    }
  },
  {
    slug: "route-parameters",
    title: "7. Route Parameters",
    order: 7,
    content: "<h2>Route Parameters</h2><p>Route parameters are named URL segments that are used to capture the values specified at their position in the URL.</p><p>The captured values are populated in the `req.params` object.</p>",
    interviewQuestions: [
      { question: "How are route parameters defined and accessed?", answer: "Defined with a colon (e.g., `/users/:id`) and accessed via `req.params.id`." },
      { question: "Can a route have multiple parameters?", answer: "Yes, e.g., `/users/:userId/books/:bookId`." }
    ],
    practicalTask: {
      scenario: "Fetch a user profile.",
      task: "Create an endpoint to capture the user ID from the URL and return it.",
      solutionCode: "app.get('/users/:id', (req, res) => {\n  res.json({ userId: req.params.id });\n});"
    }
  },
  {
    slug: "modular-routes",
    title: "8. Modular Route Handlers",
    order: 8,
    content: "<h2>Modularizing Handlers</h2><p>Using `app.route()` or separate controller files helps avoid duplicate route naming and typing errors.</p>",
    interviewQuestions: [
      { question: "What is app.route()?", answer: "It allows creating chainable route handlers for a route path, reducing redundancy." },
      { question: "How does app.route() differ from router?", answer: "app.route is for chaining HTTP verbs on a single path. Router is for grouping multiple paths." }
    ],
    practicalTask: {
      scenario: "Handle CRUD for books.",
      task: "Use app.route() to handle GET, POST, and PUT for '/book'.",
      solutionCode: "app.route('/book')\n  .get((req, res) => res.send('Get a book'))\n  .post((req, res) => res.send('Add a book'))\n  .put((req, res) => res.send('Update book'));"
    }
  },
  {
    slug: "controllers-mvc",
    title: "9. Controllers & MVC Pattern",
    order: 9,
    content: "<h2>MVC in Express</h2><p>Express doesn't enforce MVC, but it's highly recommended to separate route definitions from the logic (controllers).</p>",
    interviewQuestions: [
      { question: "What is a Controller in Express?", answer: "A function that encapsulates the logic for a specific route, keeping route files clean." },
      { question: "Why separate routes and controllers?", answer: "For better testability, readability, and separation of concerns." }
    ],
    practicalTask: {
      scenario: "Refactor inline logic.",
      task: "Export a controller function and use it in a route.",
      solutionCode: "// userController.js\nexports.getUser = (req, res) => res.send('User');\n// routes.js\nconst { getUser } = require('./userController');\napp.get('/user', getUser);"
    }
  },
  {
    slug: "error-handling",
    title: "10. Error Handling Strategies",
    order: 10,
    content: "<h2>Error Handling Middleware</h2><p>Define error-handling middleware functions in the same way as other middleware functions, except with four arguments instead of three: `(err, req, res, next)`.</p>",
    interviewQuestions: [
      { question: "How do you define an error-handling middleware?", answer: "It must have exactly 4 parameters: `(err, req, res, next)`." },
      { question: "How do you trigger the error handler?", answer: "By passing an error to the `next()` function, like `next(new Error('Something failed'))`." }
    ],
    practicalTask: {
      scenario: "Catch all errors globally.",
      task: "Implement a global error handler that returns a 500 status.",
      solutionCode: "app.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).send('Something broke!');\n});"
    }
  }
];

appendTopics("express", "Express.js API Design", "The definitive guide.", topics).then(() => console.log('Part 2 seeded!'));
