import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "node-auth-jwt",
    title: "26. Authentication (JWT)",
    order: 26,
    content: "<h2>Stateless Security</h2><p>JSON Web Tokens allow verification of the sender without storing session state on the server.</p>",
    interviewQuestions: [
      { question: "What are the 3 parts of a JWT?", answer: "Header, Payload, and Signature." },
      { question: "Where should JWTs be stored on the client?", answer: "Ideally in HttpOnly, Secure cookies to prevent XSS attacks." }
    ],
    practicalTask: {
      scenario: "Signing a JWT.",
      task: "Sign a payload with a secret key.",
      solutionCode: "import jwt from 'jsonwebtoken';\nconst token = jwt.sign({ id: 1 }, 'secret', { expiresIn: '1h' });"
    }
  },
  {
    slug: "node-session-management",
    title: "27. Session Management (Redis)",
    order: 27,
    content: "<h2>Stateful Sessions</h2><p>Storing session data in a fast key-value store like Redis allows session invalidation and scaling.</p>",
    interviewQuestions: [
      { question: "Why use Redis over memory for sessions?", answer: "In-memory sessions are lost if the server restarts and aren't shared across a cluster." },
      { question: "What is express-session?", answer: "A middleware that manages session state, optionally storing it in Redis." }
    ],
    practicalTask: {
      scenario: "Connecting Redis.",
      task: "Create a basic Redis client connection.",
      solutionCode: "import { createClient } from 'redis';\nconst client = createClient();\nawait client.connect();"
    }
  },
  {
    slug: "node-rbac",
    title: "28. Role-Based Access Control",
    order: 28,
    content: "<h2>Authorization Mechanisms</h2><p>Restricting API endpoints based on the authenticated user's roles.</p>",
    interviewQuestions: [
      { question: "Difference between Authentication and Authorization?", answer: "Authentication proves WHO you are; Authorization determines WHAT you can do." },
      { question: "How to implement RBAC in Express?", answer: "By writing a middleware that checks user roles before calling next()." }
    ],
    practicalTask: {
      scenario: "Admin-only middleware.",
      task: "Write a middleware to reject non-admins.",
      solutionCode: "const requireAdmin = (req, res, next) => {\n  if(req.user.role !== 'admin') return res.status(403).send('Forbidden');\n  next();\n};"
    }
  },
  {
    slug: "node-websockets",
    title: "29. WebSockets & Socket.io",
    order: 29,
    content: "<h2>Real-Time Communication</h2><p>WebSockets provide a persistent, bidirectional communication channel between client and server.</p>",
    interviewQuestions: [
      { question: "How is WebSocket different from HTTP?", answer: "HTTP is stateless and request-response based; WebSockets are persistent and bidirectional." },
      { question: "Why use Socket.io instead of native WebSockets?", answer: "Socket.io provides fallbacks (like long polling), automatic reconnections, and broadcasting." }
    ],
    practicalTask: {
      scenario: "Handling a connection.",
      task: "Listen for a 'connection' event in Socket.io.",
      solutionCode: "import { Server } from 'socket.io';\nconst io = new Server(3000);\nio.on('connection', (socket) => console.log('Connected!'));"
    }
  },
  {
    slug: "node-graphql",
    title: "30. GraphQL API Development",
    order: 30,
    content: "<h2>Query Languages for APIs</h2><p>GraphQL allows clients to request exactly the data they need, no more, no less.</p>",
    interviewQuestions: [
      { question: "What is the N+1 query problem?", answer: "A performance issue where resolving a list of items causes an additional DB query for each item's relations." },
      { question: "How do you solve N+1 in GraphQL?", answer: "By using DataLoader to batch and cache database requests." }
    ],
    practicalTask: {
      scenario: "Define a simple schema.",
      task: "Write a GraphQL schema string with a Query type.",
      solutionCode: "const typeDefs = `type Query { hello: String }`;"
    }
  }
];

appendTopics("nodejs", "Node.js Enterprise Backend", "The definitive guide.", topics);
