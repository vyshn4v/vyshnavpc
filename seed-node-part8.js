import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "node-logging",
    title: "36. Logging & Monitoring",
    order: 36,
    content: "<h2>Observability</h2><p>Structured logging using Winston or Pino allows log aggregation and querying in production.</p>",
    interviewQuestions: [
      { question: "Why avoid console.log in production?", answer: "It blocks the event loop in certain environments and lacks structure/log levels." },
      { question: "What is structured logging?", answer: "Emitting logs as JSON objects so that machines can easily parse and search them." }
    ],
    practicalTask: {
      scenario: "Set up a structured logger.",
      task: "Create a basic Pino logger and log an info message.",
      solutionCode: "import pino from 'pino';\nconst logger = pino();\nlogger.info('Server started');"
    }
  },
  {
    slug: "node-pm2",
    title: "37. PM2 Process Management",
    order: 37,
    content: "<h2>Production Process Manager</h2><p>PM2 keeps Node apps alive forever, reloads them without downtime, and manages cluster mode.</p>",
    interviewQuestions: [
      { question: "How does PM2 achieve zero-downtime reloads?", answer: "By spawning new workers before killing the old ones." },
      { question: "Can PM2 handle clustering automatically?", answer: "Yes, by passing the -i max parameter, PM2 scales the app across all CPU cores." }
    ],
    practicalTask: {
      scenario: "Start an app with PM2.",
      task: "Write the shell command to start an app with PM2 in cluster mode.",
      solutionCode: "pm2 start app.js -i max"
    }
  },
  {
    slug: "node-docker",
    title: "38. Dockerizing Node Apps",
    order: 38,
    content: "<h2>Containerization</h2><p>Packaging a Node.js app with its environment and dependencies into a Docker image.</p>",
    interviewQuestions: [
      { question: "Why use multi-stage Docker builds?", answer: "To keep the final production image small by leaving build dependencies behind." },
      { question: "Why run npm ci instead of npm install in CI/CD?", answer: "npm ci strictly installs exact versions from package-lock.json and is faster." }
    ],
    practicalTask: {
      scenario: "Write a simple Dockerfile.",
      task: "Specify the base image and command for a Node app.",
      solutionCode: "FROM node:18-alpine\nWORKDIR /app\nCOPY package.json .\nRUN npm install\nCOPY . .\nCMD [\"node\", \"app.js\"]"
    }
  },
  {
    slug: "node-cicd",
    title: "39. CI/CD Pipelines",
    order: 39,
    content: "<h2>Continuous Integration & Deployment</h2><p>Automating tests, linting, and deployments using GitHub Actions or GitLab CI.</p>",
    interviewQuestions: [
      { question: "What is the purpose of CI?", answer: "To automatically run tests and checks on every push to ensure code quality." },
      { question: "What steps are typical in a Node.js CI pipeline?", answer: "Linting, Unit Testing, Integration Testing, and Building." }
    ],
    practicalTask: {
      scenario: "Define a step in GitHub Actions.",
      task: "Write a YAML step to run npm tests.",
      solutionCode: "- name: Run tests\n  run: npm test"
    }
  },
  {
    slug: "node-cloud-deployment",
    title: "40. Cloud Deployment",
    order: 40,
    content: "<h2>Going Live</h2><p>Deploying Node.js to AWS, Heroku, Vercel, or Kubernetes environments.</p>",
    interviewQuestions: [
      { question: "What is the difference between PaaS and IaaS?", answer: "PaaS (like Heroku) manages the underlying infrastructure; IaaS (like AWS EC2) provides bare VMs." },
      { question: "Why use Nginx as a reverse proxy for Node.js?", answer: "Nginx handles SSL termination, caching, and serving static files much faster than Node.js." }
    ],
    practicalTask: {
      scenario: "Configure a port dynamically.",
      task: "Listen on a port provided by the environment, fallback to 3000.",
      solutionCode: "const PORT = process.env.PORT || 3000;\napp.listen(PORT);"
    }
  }
];

appendTopics("nodejs", "Node.js Enterprise Backend", "The definitive guide.", topics);
