import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "express-intro",
    title: "1. Introduction to Express.js",
    order: 1,
    content: "<h2>Welcome to Express.js</h2><p>Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.</p><p>It acts as a thin layer of fundamental web application features, without obscuring Node.js features that you know and love.</p>",
    interviewQuestions: [
      { question: "What is Express.js and how does it relate to Node.js?", answer: "Express.js is a minimal web application framework built on top of Node.js. While Node.js provides the basic HTTP server capabilities, Express simplifies routing, middleware integration, and request/response handling." },
      { question: "Is Express.js an opinionated framework?", answer: "No, Express is unopinionated. It doesn't enforce a specific project structure or set of tools, allowing developers full flexibility." }
    ],
    practicalTask: {
      scenario: "You need to set up a basic web server.",
      task: "Create a basic Express application that listens on port 3000 and responds with 'Hello World'.",
      solutionCode: "const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => res.send('Hello World'));\napp.listen(3000, () => console.log('Server ready'));"
    }
  },
  {
    slug: "routing-basics",
    title: "2. Routing Basics",
    order: 2,
    content: "<h2>Basic Routing</h2><p>Routing refers to how an application's endpoints (URIs) respond to client requests.</p><p>You define routing using methods of the Express app object that correspond to HTTP methods; for example, `app.get()` to handle GET requests and `app.post` to handle POST requests.</p>",
    interviewQuestions: [
      { question: "How does routing work in Express?", answer: "Routing in Express uses methods on the app object (like app.get, app.post) combined with a path string or regex to match incoming request URIs, executing a callback function when a match occurs." },
      { question: "What is a route handler?", answer: "A route handler is a callback function executed when a specific route is matched. It takes the request and response objects as arguments." }
    ],
    practicalTask: {
      scenario: "A client needs an API with multiple endpoints.",
      task: "Create a GET route at '/users' and a POST route at '/users'.",
      solutionCode: "app.get('/users', (req, res) => res.send('List of users'));\napp.post('/users', (req, res) => res.send('User created'));"
    }
  },
  {
    slug: "middleware-fundamentals",
    title: "3. Middleware Fundamentals",
    order: 3,
    content: "<h2>Understanding Middleware</h2><p>Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle.</p><p>They can execute code, make changes to req/res, and end the cycle or call `next()`.</p>",
    interviewQuestions: [
      { question: "What is middleware in Express?", answer: "Middleware refers to functions that intercept incoming requests before they reach the final route handler. They can modify requests/responses, perform logging, or handle authentication." },
      { question: "What happens if a middleware doesn't call next()?", answer: "If next() is not called, the request is left hanging, and the client will eventually time out because the request-response cycle is never completed or passed on." }
    ],
    practicalTask: {
      scenario: "You need to log every request made to the server.",
      task: "Write a custom middleware that logs the HTTP method and URL of every incoming request.",
      solutionCode: "app.use((req, res, next) => {\n  console.log(`${req.method} ${req.url}`);\n  next();\n});"
    }
  },
  {
    slug: "request-response",
    title: "4. Request & Response Objects",
    order: 4,
    content: "<h2>Req & Res</h2><p>The `req` object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, etc.</p><p>The `res` object represents the HTTP response that an Express app sends when it gets an HTTP request.</p>",
    interviewQuestions: [
      { question: "How do you access query parameters in Express?", answer: "Query parameters are accessed via the `req.query` object. For example, `req.query.search` gets the value of the 'search' query string parameter." },
      { question: "What is the difference between res.send() and res.json()?", answer: "res.send() can send various types of responses (Buffer, String, Object, Array) and sets the Content-Type automatically. res.json() specifically formats the response as JSON and ensures the Content-Type is application/json." }
    ],
    practicalTask: {
      scenario: "You are building a search endpoint.",
      task: "Create an endpoint '/search' that reads a 'q' query parameter and returns a JSON object with the query.",
      solutionCode: "app.get('/search', (req, res) => {\n  res.json({ query: req.query.q });\n});"
    }
  },
  {
    slug: "static-files",
    title: "5. Serving Static Files",
    order: 5,
    content: "<h2>Static Assets</h2><p>To serve static files such as images, CSS files, and JavaScript files, use the `express.static` built-in middleware function in Express.</p><p>Pass the name of the directory that contains the static assets to the `express.static` middleware function to start serving the files directly.</p>",
    interviewQuestions: [
      { question: "How do you serve static files in an Express application?", answer: "By using the built-in `express.static()` middleware and specifying the directory path, e.g., `app.use(express.static('public'))`." },
      { question: "Can you serve static files from multiple directories?", answer: "Yes, you can call `app.use(express.static(...))` multiple times. Express will search directories in the order they are defined." }
    ],
    practicalTask: {
      scenario: "You need to serve assets like images and CSS.",
      task: "Configure Express to serve static files from a directory named 'public'.",
      solutionCode: "const path = require('path');\napp.use(express.static(path.join(__dirname, 'public')));"
    }
  }
];

appendTopics("express", "Express.js API Design", "The definitive guide.", topics).then(() => console.log('Part 1 seeded!'));
