import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "express-intro",
    title: "21. Introduction to Express.js",
    order: 21,
    content: "<h2>The Standard Node Framework</h2><p>Express provides a minimal interface to build web applications and APIs quickly.</p>",
    interviewQuestions: [
      { question: "What is Express.js?", answer: "A fast, unopinionated, minimalist web framework for Node.js." },
      { question: "Does Express handle DB connections?", answer: "No, Express only handles HTTP routing and middleware." }
    ],
    practicalTask: {
      scenario: "Create a basic Express server.",
      task: "Initialize an Express app and listen on port 3000.",
      solutionCode: "import express from 'express';\nconst app = express();\napp.listen(3000);"
    }
  },
  {
    slug: "express-middleware",
    title: "22. Express Middleware",
    order: 22,
    content: "<h2>The Core of Express</h2><p>Middleware are functions that have access to the request, response, and the next middleware function.</p>",
    interviewQuestions: [
      { question: "What is next()?", answer: "A function that passes control to the next middleware in the stack." },
      { question: "How do you parse JSON bodies in Express?", answer: "Using the built-in middleware: app.use(express.json())." }
    ],
    practicalTask: {
      scenario: "Writing a custom logger middleware.",
      task: "Create a middleware that logs the HTTP method.",
      solutionCode: "app.use((req, res, next) => { console.log(req.method); next(); });"
    }
  },
  {
    slug: "express-restful-api",
    title: "23. RESTful API Design",
    order: 23,
    content: "<h2>Resource-Based URLs</h2><p>Designing APIs around resources using standard HTTP methods: GET, POST, PUT, DELETE.</p>",
    interviewQuestions: [
      { question: "What is the difference between PUT and PATCH?", answer: "PUT replaces the entire resource, PATCH applies partial updates." },
      { question: "What status code should a successful POST return?", answer: "201 Created." }
    ],
    practicalTask: {
      scenario: "Create a REST router.",
      task: "Create an Express router handling a GET request for users.",
      solutionCode: "const router = express.Router();\nrouter.get('/', (req, res) => res.json([{id: 1}]));"
    }
  },
  {
    slug: "express-validation",
    title: "24. Data Validation",
    order: 24,
    content: "<h2>Validating Payloads</h2><p>Using libraries like Zod or Joi to ensure incoming API data meets expected schemas.</p>",
    interviewQuestions: [
      { question: "Why is server-side validation necessary?", answer: "Client-side validation can be bypassed; the server must independently verify data integrity." },
      { question: "What happens if validation fails?", answer: "The server should return a 400 Bad Request with details of the validation errors." }
    ],
    practicalTask: {
      scenario: "Validate an email payload.",
      task: "Use Zod to create a schema requiring an email.",
      solutionCode: "import { z } from 'zod';\nconst schema = z.object({ email: z.string().email() });"
    }
  },
  {
    slug: "express-mongoose",
    title: "25. Mongoose & MongoDB",
    order: 25,
    content: "<h2>Object Data Modeling</h2><p>Mongoose provides a schema-based solution to model your application data for MongoDB.</p>",
    interviewQuestions: [
      { question: "What is the difference between a Schema and a Model?", answer: "A Schema defines the structure; a Model is a compiled constructor providing methods to query the DB." },
      { question: "How do you connect to MongoDB?", answer: "Using mongoose.connect('mongodb://...')." }
    ],
    practicalTask: {
      scenario: "Define a User model.",
      task: "Create a Mongoose schema and model for a User with a name.",
      solutionCode: "import mongoose from 'mongoose';\nconst userSchema = new mongoose.Schema({ name: String });\nconst User = mongoose.model('User', userSchema);"
    }
  }
];

appendTopics("nodejs", "Node.js Enterprise Backend", "The definitive guide.", topics);
