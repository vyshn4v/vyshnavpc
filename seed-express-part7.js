import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "environment-variables",
    title: "31. Environment Variables",
    order: 31,
    content: "<h2>Configuration Management</h2><p>Environment variables allow you to configure different behaviors for different environments (dev, staging, prod) without changing code. Use `dotenv` module.</p>",
    interviewQuestions: [
      { question: "How do you access environment variables in Node.js?", answer: "Using the `process.env` object." },
      { question: "Why shouldn't you commit your .env file?", answer: "It contains sensitive information like database credentials and API keys." }
    ],
    practicalTask: {
      scenario: "Load secret configuration.",
      task: "Use dotenv to load and print an environment variable.",
      solutionCode: "require('dotenv').config();\nconsole.log(process.env.MY_SECRET_KEY);"
    }
  },
  {
    slug: "logging-monitoring",
    title: "32. Logging and Monitoring",
    order: 32,
    content: "<h2>Observability</h2><p>Logging is critical for debugging. Winston provides structured, level-based logging. Morgan logs HTTP requests.</p>",
    interviewQuestions: [
      { question: "What is Winston?", answer: "Winston is a versatile logging library for Node.js that supports multiple transports (console, file, external services)." },
      { question: "How do Morgan and Winston differ?", answer: "Morgan is specifically an HTTP request logger middleware. Winston is a general-purpose logging library." }
    ],
    practicalTask: {
      scenario: "Set up HTTP request logging.",
      task: "Integrate Morgan in 'combined' mode.",
      solutionCode: "const morgan = require('morgan');\napp.use(morgan('combined'));"
    }
  },
  {
    slug: "compression-caching",
    title: "33. Compression and Caching Headers",
    order: 33,
    content: "<h2>Optimizing Payload</h2><p>The `compression` middleware compresses response bodies. Setting Cache-Control headers tells browsers how long to cache responses.</p>",
    interviewQuestions: [
      { question: "What does the compression middleware do?", answer: "It compresses response bodies using gzip or deflate, significantly reducing the size of the payload sent over the network." },
      { question: "How do you set a caching header in Express?", answer: "Using `res.set('Cache-Control', 'public, max-age=31557600')`." }
    ],
    practicalTask: {
      scenario: "Compress API responses.",
      task: "Install and use the compression middleware.",
      solutionCode: "const compression = require('compression');\napp.use(compression());"
    }
  },
  {
    slug: "clustering",
    title: "34. Clustering & Load Balancing",
    order: 34,
    content: "<h2>Scaling Node.js</h2><p>Node runs in a single thread. Clustering allows you to spawn multiple Node processes to utilize multiple CPU cores.</p>",
    interviewQuestions: [
      { question: "What is the Node.js cluster module?", answer: "It allows creation of child processes (workers) that run simultaneously and share the same server port." },
      { question: "What is PM2?", answer: "PM2 is a production process manager for Node.js that handles clustering, restarts on crash, and log management automatically." }
    ],
    practicalTask: {
      scenario: "Run Express on all cores.",
      task: "Use the cluster module to fork workers.",
      solutionCode: "const cluster = require('cluster');\nconst os = require('os');\nif (cluster.isMaster) {\n  os.cpus().forEach(() => cluster.fork());\n} else {\n  app.listen(3000);\n}"
    }
  },
  {
    slug: "deployment-best-practices",
    title: "35. Deployment Best Practices",
    order: 35,
    content: "<h2>Production Readiness</h2><p>Run Node in production mode. Use a reverse proxy (Nginx). Don't run Node as root. Ensure proper error handling to prevent process crashes.</p>",
    interviewQuestions: [
      { question: "Why set NODE_ENV=production?", answer: "Express caches view templates and CSS files, and generates less verbose error messages, significantly improving performance." },
      { question: "Why use Nginx in front of Node.js?", answer: "Nginx excels at serving static files, SSL termination, and load balancing, freeing up Node to focus on application logic." }
    ],
    practicalTask: {
      scenario: "Check production mode.",
      task: "Write logic that conditionally executes based on NODE_ENV.",
      solutionCode: "if (process.env.NODE_ENV === 'production') {\n  app.use(helmet());\n} else {\n  app.use(morgan('dev'));\n}"
    }
  }
];

appendTopics("express", "Express.js API Design", "The definitive guide.", topics).then(() => console.log('Part 7 seeded!'));
