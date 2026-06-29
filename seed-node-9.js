import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    order: 41,
    title: "Node.js Real-time Communication with WebSockets",
    content: `### 1. Conceptual Overview
Real-time communication in Node.js allows bidirectional, low-latency data exchange between clients and servers. WebSockets are the standard protocol for achieving this, bypassing the traditional HTTP request-response overhead.

### 2. Architecture & Mechanics
WebSockets start as an HTTP handshake, then upgrade to a persistent TCP connection. The \`ws\` or \`socket.io\` libraries are typically used in Node.js to manage the event-driven communication and heartbeat mechanisms.

### 3. Implementation: Standard vs Optimized
Standard implementation often handles all connections on a single node process, risking bottlenecks.
Optimized implementation leverages Redis pub/sub adapters to distribute WebSocket events across multiple Node.js instances in a cluster or microservice setup.

### 4. Trade-offs & Complexity
WebSockets require managing connection state, dealing with intermittent dropouts, and ensuring security against DDoS attacks. Scalability introduces complexity, needing external message brokers.`,
    interviewQuestions: [
      {
        question: "How does a WebSocket connection differ from HTTP polling?",
        answer: "WebSockets maintain a persistent, bidirectional connection allowing server push, whereas HTTP polling requires the client to repeatedly request data."
      },
      {
        question: "Why might you use socket.io over the native ws library?",
        answer: "socket.io provides built-in fallbacks (like long-polling), room/namespace support, and automatic reconnections out of the box."
      },
      {
        question: "How do you scale WebSocket connections across multiple Node.js processes?",
        answer: "By using a message broker like Redis (with redis-adapter) to publish and subscribe to messages across all active processes."
      },
      {
        question: "What are sticky sessions and why are they needed for WebSockets in a cluster?",
        answer: "Sticky sessions route requests from a specific client to the same server process, essential for the HTTP upgrade process when using fallbacks like long-polling."
      },
      {
        question: "How do you handle dropped WebSocket connections?",
        answer: "Implement client-side auto-reconnection logic and server-side heartbeat (ping/pong) mechanisms to detect dead connections and clean up resources."
      }
    ],
    practicalTask: "Build a real-time chat room using Express and Socket.io, then scale it to two instances using a Redis adapter."
  },
  {
    order: 42,
    title: "Node.js GraphQL API Development",
    content: `### 1. Conceptual Overview
GraphQL is a query language for APIs that allows clients to request exactly the data they need. In Node.js, it provides a powerful alternative to REST by reducing over-fetching and under-fetching.

### 2. Architecture & Mechanics
A GraphQL server requires a defined Schema (Types, Queries, Mutations) and Resolvers (functions that fetch data for each field). Tools like \`apollo-server\` or \`express-graphql\` integrate this seamlessly with Node.js HTTP servers.

### 3. Implementation: Standard vs Optimized
A standard approach might suffer from the N+1 problem, making multiple database calls for nested relations.
An optimized implementation utilizes \`DataLoader\` to batch and cache database requests, drastically reducing the number of queries.

### 4. Trade-offs & Complexity
GraphQL provides ultimate flexibility for frontend consumers but pushes the complexity of authorization, rate limiting, and performance optimization (like N+1 issues) to the backend.`,
    interviewQuestions: [
      {
        question: "What problem does GraphQL solve compared to REST?",
        answer: "It solves over-fetching and under-fetching by allowing the client to specify exactly which fields it needs."
      },
      {
        question: "What is the N+1 problem in GraphQL?",
        answer: "It occurs when a resolver fetches related entities individually for a list of items, resulting in N additional database queries instead of 1."
      },
      {
        question: "How does DataLoader solve the N+1 problem?",
        answer: "DataLoader batches multiple individual requests for the same type of resource into a single database query, and caches the results per request."
      },
      {
        question: "What is a GraphQL Mutation?",
        answer: "A Mutation is a GraphQL operation intended to modify data on the server (create, update, delete) and return the updated state."
      },
      {
        question: "How do you handle file uploads in a GraphQL API?",
        answer: "Using libraries like graphql-upload that implement the GraphQL multipart request specification, allowing streams in resolvers."
      }
    ],
    practicalTask: "Create a GraphQL API for a blog system with Queries for posts and authors, and a Mutation to add a new post. Implement DataLoader to fetch authors efficiently."
  },
  {
    order: 43,
    title: "Node.js Serverless Functions with AWS Lambda",
    content: `### 1. Conceptual Overview
Serverless computing allows running Node.js code in response to events without provisioning or managing servers. AWS Lambda is the most prominent platform for executing Node.js functions on demand.

### 2. Architecture & Mechanics
Code is packaged into a zip file (with node_modules) and uploaded to Lambda. Execution is triggered by events (API Gateway, S3, SQS). AWS spins up a container, runs the handler function, and spins it down.

### 3. Implementation: Standard vs Optimized
Standard implementation includes large dependency trees, leading to slow "cold starts".
Optimized implementation uses bundlers (like esbuild or webpack) to tree-shake and minimize the deployment package, and reuses database connections across invocations using global variables.

### 4. Trade-offs & Complexity
Serverless reduces operational overhead and scales automatically, but introduces cold start latency, limits on execution time, and challenges in local debugging and monitoring.`,
    interviewQuestions: [
      {
        question: "What is a 'cold start' in AWS Lambda?",
        answer: "A cold start is the delay experienced when a new Lambda container is initialized to handle a request after a period of inactivity."
      },
      {
        question: "How can you reduce cold start times in Node.js Lambdas?",
        answer: "By minimizing the package size using bundlers (e.g., esbuild), reducing the number of dependencies, and avoiding heavy synchronous work outside the handler."
      },
      {
        question: "How do you manage database connections in a Serverless environment?",
        answer: "Define the connection outside the handler function so it can be reused across warm invocations, avoiding a new connection per request."
      },
      {
        question: "What is the Serverless Framework?",
        answer: "It is an open-source CLI tool that simplifies deploying serverless applications by managing infrastructure as code (like AWS CloudFormation)."
      },
      {
        question: "How do you handle long-running background tasks in Lambda?",
        answer: "Since Lambda has a 15-minute timeout, long tasks should be split into smaller chunks, orchestrated using AWS Step Functions, or offloaded to AWS Fargate."
      }
    ],
    practicalTask: "Deploy a Node.js AWS Lambda function using the Serverless Framework that connects to a database and retrieves a list of users."
  },
  {
    order: 44,
    title: "Node.js Microservices Architecture",
    content: `### 1. Conceptual Overview
Microservices architecture breaks down a monolithic Node.js application into smaller, independent services that communicate over a network, each responsible for a specific business domain.

### 2. Architecture & Mechanics
Services can communicate synchronously (REST, gRPC) or asynchronously (Message Brokers like RabbitMQ or Kafka). API Gateways route external requests to the appropriate internal services.

### 3. Implementation: Standard vs Optimized
Standard implementation uses direct HTTP calls between services, causing tight coupling and cascading failures.
Optimized implementation employs event-driven architecture with Kafka for decoupled communication, circuit breakers to prevent cascading failures, and distributed tracing.

### 4. Trade-offs & Complexity
Microservices offer independent deployment and scaling but introduce significant complexity in data consistency (distributed transactions), networking, debugging, and infrastructure management.`,
    interviewQuestions: [
      {
        question: "What is the difference between monolithic and microservices architecture?",
        answer: "A monolith bundles all features into a single deployable unit, whereas microservices split features into independently deployable, loosely coupled services."
      },
      {
        question: "How do microservices communicate with each other?",
        answer: "Synchronously via HTTP/REST or gRPC, or asynchronously via message brokers like RabbitMQ, Kafka, or AWS SQS."
      },
      {
        question: "What is an API Gateway?",
        answer: "It is a single entry point that routes client requests to the appropriate backend microservices, often handling auth, rate limiting, and composition."
      },
      {
        question: "How do you handle distributed transactions across multiple services?",
        answer: "Using patterns like the Saga pattern, where local transactions are sequenced, and compensating transactions are triggered if a step fails."
      },
      {
        question: "What is a Circuit Breaker pattern?",
        answer: "A pattern that prevents a service from repeatedly trying to execute a failing operation, preventing cascading failures and giving the failing service time to recover."
      }
    ],
    practicalTask: "Design and implement a tiny microservice setup using two Node.js Express apps: an Order Service and an Inventory Service communicating via HTTP."
  },
  {
    order: 45,
    title: "Node.js Performance Monitoring and APM",
    content: `### 1. Conceptual Overview
Monitoring and Application Performance Management (APM) in Node.js are critical for identifying bottlenecks, memory leaks, and ensuring the health of production applications.

### 2. Architecture & Mechanics
APM tools instrument Node.js code to track response times, database queries, and external requests. Node.js built-in modules like \`perf_hooks\` and V8 profiling provide low-level metrics.

### 3. Implementation: Standard vs Optimized
Standard implementation relies only on console logging and basic OS-level metrics (CPU/RAM).
Optimized implementation uses tools like Datadog, New Relic, or Prometheus/Grafana to collect custom metrics, trace distributed requests, and trigger alerts on anomalies.

### 4. Trade-offs & Complexity
Adding APM agents introduces a small performance overhead and requires careful configuration to avoid logging sensitive data, but is indispensable for maintaining reliability at scale.`,
    interviewQuestions: [
      {
        question: "What are some common tools for monitoring Node.js applications?",
        answer: "Datadog, New Relic, Dynatrace, AppDynamics, and open-source stacks like Prometheus with Grafana."
      },
      {
        question: "How do you detect memory leaks in Node.js?",
        answer: "By capturing heap snapshots using tools like node-inspector or Chrome DevTools, and comparing them over time to find objects that are not garbage collected."
      },
      {
        question: "What is distributed tracing?",
        answer: "A method used to track requests as they flow across multiple microservices, helping to identify latency bottlenecks in complex architectures."
      },
      {
        question: "What role does the \`perf_hooks\` module play in Node.js?",
        answer: "It provides an API compatible with the W3C Web Performance Timeline specification, allowing developers to measure the execution time of specific code blocks."
      },
      {
        question: "Why is tracking Event Loop delay important?",
        answer: "Because a high event loop delay indicates that synchronous operations are blocking the thread, preventing Node.js from handling new I/O tasks efficiently."
      }
    ],
    practicalTask: "Integrate a Prometheus client into an Express application to expose a \`/metrics\` endpoint tracking HTTP request duration, and capture a V8 heap snapshot."
  }
];

await appendTopics('nodejs', 'Node.js Masterclass', '...', topics);
