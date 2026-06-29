import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "websockets-socketio",
    title: "36. WebSockets in Express (Socket.io)",
    order: 36,
    content: "<h2>Real-Time Communication</h2><p>Socket.IO enables real-time, bidirectional, and event-based communication between the browser and the server.</p>",
    interviewQuestions: [
      { question: "How does WebSockets differ from HTTP?", answer: "HTTP is request-response based and stateless. WebSockets provide a persistent, full-duplex connection allowing the server to push data to the client." },
      { question: "How do you integrate Socket.io with Express?", answer: "You must attach Socket.io to the raw HTTP server instance, not the Express app directly." }
    ],
    practicalTask: {
      scenario: "Set up a WebSocket server.",
      task: "Initialize Socket.io with an Express server.",
      solutionCode: "const http = require('http');\nconst { Server } = require('socket.io');\nconst server = http.createServer(app);\nconst io = new Server(server);\nio.on('connection', (socket) => console.log('User connected'));\nserver.listen(3000);"
    }
  },
  {
    slug: "graphql-apollo",
    title: "37. GraphQL Integration",
    order: 37,
    content: "<h2>Alternative to REST</h2><p>GraphQL is a query language for APIs. Apollo Server can be integrated into Express as middleware to handle GraphQL requests.</p>",
    interviewQuestions: [
      { question: "What is the main advantage of GraphQL over REST?", answer: "GraphQL allows clients to request exactly the data they need, eliminating over-fetching and under-fetching issues." },
      { question: "What are Resolvers in GraphQL?", answer: "Resolvers are functions that resolve a value for a type or field in a schema, fetching the actual data." }
    ],
    practicalTask: {
      scenario: "Integrate Apollo Server.",
      task: "Apply Apollo middleware to an Express app.",
      solutionCode: "const { ApolloServer } = require('apollo-server-express');\nconst server = new ApolloServer({ typeDefs, resolvers });\nawait server.start();\nserver.applyMiddleware({ app });"
    }
  },
  {
    slug: "testing-express",
    title: "38. Testing Express Apps",
    order: 38,
    content: "<h2>Automated Testing</h2><p>Supertest allows you to test HTTP endpoints in Express without actually listening on a network port. Use it alongside test runners like Jest.</p>",
    interviewQuestions: [
      { question: "What is Supertest?", answer: "Supertest is a library providing a high-level abstraction for testing Node.js HTTP servers, specifically Express." },
      { question: "Why shouldn't you call app.listen() during tests?", answer: "It occupies a network port and slows down tests. Supertest binds the app to an ephemeral port automatically." }
    ],
    practicalTask: {
      scenario: "Test a GET endpoint.",
      task: "Use Supertest and Jest to assert a 200 OK response.",
      solutionCode: "const request = require('supertest');\nconst app = require('../app');\ntest('GET / returns 200', async () => {\n  const res = await request(app).get('/');\n  expect(res.statusCode).toBe(200);\n});"
    }
  },
  {
    slug: "typescript-express",
    title: "39. TypeScript with Express",
    order: 39,
    content: "<h2>Type Safety</h2><p>TypeScript adds static typing to JS. When used with Express, it provides autocomplete for req/res objects and helps catch errors at compile time.</p>",
    interviewQuestions: [
      { question: "How do you type Request and Response objects in TypeScript?", answer: "Import them from the 'express' types package: `import { Request, Response } from 'express';`" },
      { question: "What package provides the type definitions for Express?", answer: "The `@types/express` package from DefinitelyTyped." }
    ],
    practicalTask: {
      scenario: "Type a route handler.",
      task: "Write a typed Express GET route in TypeScript.",
      solutionCode: "import express, { Request, Response } from 'express';\nconst app = express();\napp.get('/', (req: Request, res: Response) => {\n  res.send('Hello TS');\n});"
    }
  },
  {
    slug: "microservices",
    title: "40. Microservices Architecture",
    order: 40,
    content: "<h2>Distributed Systems</h2><p>Express is lightweight and perfect for building small, independent microservices that communicate via HTTP APIs or message brokers like RabbitMQ.</p>",
    interviewQuestions: [
      { question: "What is a microservice?", answer: "An architectural style that structures an application as a collection of loosely coupled, independently deployable services." },
      { question: "How do microservices communicate?", answer: "Synchronously via HTTP/REST or gRPC, or asynchronously via message brokers like RabbitMQ or Kafka." }
    ],
    practicalTask: {
      scenario: "Set up a microservice.",
      task: "Create a minimal service that just returns user data.",
      solutionCode: "const express = require('express');\nconst app = express();\napp.get('/users/:id', (req, res) => res.json({ id: req.params.id, service: 'User Service' }));\napp.listen(4001);"
    }
  }
];

appendTopics("express", "Express.js API Design", "The definitive guide.", topics).then(() => console.log('Part 8 seeded!'));
