import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "body-parsing",
    title: "11. Body Parsing",
    order: 11,
    content: "<h2>Parsing Requests</h2><p>To access `req.body`, you need to use body-parsing middleware such as `express.json()` and `express.urlencoded()`.</p>",
    interviewQuestions: [
      { question: "Why is req.body undefined by default?", answer: "Because Express does not automatically parse the incoming request body to save on overhead." },
      { question: "How do you parse JSON bodies?", answer: "By using `app.use(express.json())` middleware." }
    ],
    practicalTask: {
      scenario: "Accept JSON data in a POST request.",
      task: "Setup JSON parsing and echo the body.",
      solutionCode: "app.use(express.json());\napp.post('/data', (req, res) => res.json(req.body));"
    }
  },
  {
    slug: "third-party-middleware",
    title: "12. Third-Party Middleware",
    order: 12,
    content: "<h2>Enhancing Express</h2><p>Popular 3rd party middlewares include Morgan (logging), Helmet (security), and CORS.</p>",
    interviewQuestions: [
      { question: "What does the CORS middleware do?", answer: "It enables Cross-Origin Resource Sharing, allowing frontends on different domains to make API requests." },
      { question: "Why use Helmet?", answer: "It secures Express apps by setting various HTTP headers to mitigate common web vulnerabilities." }
    ],
    practicalTask: {
      scenario: "Secure your API headers.",
      task: "Install and integrate helmet middleware.",
      solutionCode: "const helmet = require('helmet');\napp.use(helmet());"
    }
  },
  {
    slug: "file-uploads",
    title: "13. File Uploads (Multer)",
    order: 13,
    content: "<h2>Handling multipart/form-data</h2><p>Express cannot handle file uploads out of the box. `multer` is the standard middleware for handling multipart form data.</p>",
    interviewQuestions: [
      { question: "What is Multer used for?", answer: "Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files." },
      { question: "Does Multer handle JSON bodies?", answer: "No, Multer is strictly for multipart/form-data." }
    ],
    practicalTask: {
      scenario: "Implement single file upload.",
      task: "Setup multer to upload an image.",
      solutionCode: "const multer = require('multer');\nconst upload = multer({ dest: 'uploads/' });\napp.post('/upload', upload.single('avatar'), (req, res) => res.send('Uploaded'));"
    }
  },
  {
    slug: "custom-middleware",
    title: "14. Custom Middleware Authoring",
    order: 14,
    content: "<h2>Writing your own</h2><p>You can create configurable middleware by returning a function from a factory function.</p>",
    interviewQuestions: [
      { question: "How do you pass arguments to a custom middleware?", answer: "By wrapping it in a factory function that takes the arguments and returns the middleware function: `(args) => (req, res, next) => { ... }`." },
      { question: "Can a middleware modify req or res?", answer: "Yes, it can append data to `req` (like `req.user`) or alter headers in `res`." }
    ],
    practicalTask: {
      scenario: "Create a configurable logger.",
      task: "Write a middleware factory that logs a prefix before the URL.",
      solutionCode: "const logger = (prefix) => (req, res, next) => {\n  console.log(`${prefix} ${req.url}`);\n  next();\n};\napp.use(logger('INFO:'));"
    }
  },
  {
    slug: "async-middleware",
    title: "15. Async/Await in Middleware",
    order: 15,
    content: "<h2>Async Route Handlers</h2><p>When using async functions, unhandled rejections will crash the process or leave requests hanging. You must catch them and pass to `next()`.</p>",
    interviewQuestions: [
      { question: "How do you handle errors in async Express routes?", answer: "Either wrap the code in a try/catch block and call `next(error)`, or use a wrapper function like `express-async-handler`." },
      { question: "What is the issue with unhandled promises in Express 4?", answer: "Express 4 does not automatically catch promise rejections, leading to hanging requests." }
    ],
    practicalTask: {
      scenario: "Create a safe async route.",
      task: "Write an async route that catches errors and passes them to next().",
      solutionCode: "app.get('/async', async (req, res, next) => {\n  try {\n    const data = await someAsyncCall();\n    res.json(data);\n  } catch (error) {\n    next(error);\n  }\n});"
    }
  }
];

appendTopics("express", "Express.js API Design", "The definitive guide.", topics).then(() => console.log('Part 3 seeded!'));
