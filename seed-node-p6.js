import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "node-microservices-p6",
    title: "26. Microservices Architecture with Node.js",
    order: 26,
    content: `<h2>Scaling by Splitting</h2>
<p>Monolithic Node.js applications eventually reach limits in team scalability and deployment speed. Microservices solve this by breaking the application down into small, independently deployable services organized around business capabilities.</p>
<h3>Service Discovery and API Gateways</h3>
<p>In a microservices ecosystem, instances spin up and down dynamically. An API Gateway (like Kong, NGINX, or a custom Express router) acts as a single entry point for clients, routing requests to the appropriate internal services. Service discovery tools like Consul or Kubernetes DNS help services find each other.</p>
<pre><code>// Example of a basic API Gateway proxying requests
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use('/users', createProxyMiddleware({ target: 'http://users-service:3001', changeOrigin: true }));
app.use('/orders', createProxyMiddleware({ target: 'http://orders-service:3002', changeOrigin: true }));
app.listen(3000);
</code></pre>
<h3>Distributed Tracing</h3>
<p>When a request spans multiple services, debugging becomes difficult. Distributed tracing systems like Jaeger or Zipkin inject a unique trace ID into the HTTP headers, allowing you to visualize the full path of a request across the entire system.</p>`,
    interviewQuestions: [
      { question: "What is the primary advantage of Microservices over a Monolith?", answer: "Independent deployment, targeted scaling, and allowing different teams to work on different services without conflict." },
      { question: "What is an API Gateway?", answer: "A server that acts as an API front-end, receiving API requests, enforcing throttling and security, and routing them to the internal microservices." },
      { question: "How do microservices communicate?", answer: "Usually via synchronous HTTP/REST, gRPC, or asynchronous message brokers like RabbitMQ or Kafka." },
      { question: "What is the Saga Pattern?", answer: "A design pattern used to manage data consistency across microservices in distributed transaction scenarios. It breaks a transaction into a series of local transactions." },
      { question: "What is Distributed Tracing?", answer: "A method of tracking requests as they flow through multiple microservices, using correlation IDs to log the journey and identify bottlenecks." }
    ],
    practicalTask: {
      scenario: "Routing traffic in a microservice architecture.",
      task: "Set up a simple Express API Gateway using http-proxy-middleware.",
      solutionCode: "import express from 'express';\nimport { createProxyMiddleware } from 'http-proxy-middleware';\nexpress().use('/', createProxyMiddleware({ target: 'http://localhost:4000' })).listen(3000);"
    }
  },
  {
    slug: "node-message-queues-p6",
    title: "27. Message Queues (RabbitMQ/Kafka) Integration",
    order: 27,
    content: `<h2>Asynchronous Event-Driven Architectures</h2>
<p>To avoid tight coupling and synchronous blocking between microservices, Message Brokers are used. They provide guaranteed delivery and buffering during traffic spikes.</p>
<h3>RabbitMQ (AMQP) vs Kafka</h3>
<p>RabbitMQ is a traditional message broker supporting complex routing rules (exchanges, queues, bindings). It pushes messages to consumers and deletes them once acknowledged. Kafka is a distributed streaming platform, functioning like a distributed append-only log. Consumers pull from Kafka and track their own offset.</p>
<pre><code>import amqp from 'amqplib';

async function send() {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  const q = 'task_queue';
  await ch.assertQueue(q, { durable: true });
  ch.sendToQueue(q, Buffer.from('Hello'), { persistent: true });
  console.log("Sent 'Hello'");
}
send();
</code></pre>
<h3>Idempotency and Dead Letter Queues</h3>
<p>In distributed systems, a message might be delivered twice. Consumers must be idempotent (safe to process the same message multiple times). Messages that fail repeatedly should be routed to a Dead Letter Queue (DLQ) for manual inspection.</p>`,
    interviewQuestions: [
      { question: "What is the difference between RabbitMQ and Kafka?", answer: "RabbitMQ is a traditional broker using push-based queues and deletes messages after processing. Kafka is a distributed log using pull-based topics and retains messages for a set time." },
      { question: "What is a Dead Letter Queue (DLQ)?", answer: "A holding queue for messages that cannot be processed successfully after a certain number of retries. It prevents poison messages from clogging the main queue." },
      { question: "Why is idempotency important in message consumers?", answer: "Because message brokers often guarantee 'At Least Once' delivery. If a network blip occurs, a message might be re-delivered, so processing it twice must not cause errors." },
      { question: "What is an Exchange in RabbitMQ?", answer: "An entity that receives messages from producers and routes them to queues based on rules defined by bindings." },
      { question: "How does Kafka achieve high throughput?", answer: "Through sequential disk I/O, zero-copy network transfers, and partitioning topics across multiple broker nodes." }
    ],
    practicalTask: {
      scenario: "Connecting to a message broker.",
      task: "Write a script to connect to RabbitMQ and assert a queue.",
      solutionCode: "import amqp from 'amqplib';\namqp.connect('amqp://localhost').then(c => c.createChannel()).then(ch => ch.assertQueue('q'));"
    }
  },
  {
    slug: "node-advanced-testing-p6",
    title: "28. Advanced Testing Strategies: Mocking, CI/CD, and Profiling",
    order: 28,
    content: `<h2>Ensuring Enterprise Reliability</h2>
<p>Testing goes beyond simple unit tests. A robust strategy involves Integration Testing, E2E Testing, and continuous profiling.</p>
<h3>Mocking Dependencies</h3>
<p>Unit tests must be fast and deterministic. You should mock databases, network requests, and the file system. Tools like Jest provide built-in mocking capabilities, while libraries like Sinon.js offer spies, stubs, and mocks.</p>
<pre><code>import axios from 'axios';
import { getUser } from './userService.js';

jest.mock('axios');

test('fetches user data', async () => {
  axios.get.mockResolvedValue({ data: { name: 'John' } });
  const user = await getUser(1);
  expect(user.name).toBe('John');
});
</code></pre>
<h3>Continuous Integration (CI)</h3>
<p>CI pipelines (GitHub Actions, Jenkins) automatically run your test suite, linters, and security scanners on every commit. This prevents broken code from reaching the main branch. Integration tests spin up ephemeral databases (e.g., using Docker Compose or testcontainers) to ensure queries work against real engines.</p>`,
    interviewQuestions: [
      { question: "What is the difference between a Stub and a Mock?", answer: "A stub provides predetermined responses to calls during the test. A mock also does this but adds assertions to verify how many times and with what arguments it was called." },
      { question: "Why should you separate Unit tests from Integration tests?", answer: "Unit tests should run in milliseconds and rely on mocks. Integration tests involve real I/O (DBs, Networks) and take longer, so they are run less frequently." },
      { question: "What is Code Coverage?", answer: "A metric (usually gathered via Istanbul/nyc) that shows what percentage of your source code is executed when your test suite runs." },
      { question: "What is Mutation Testing?", answer: "A testing technique where bugs (mutations) are intentionally inserted into your code. If your tests still pass, they are not robust enough." },
      { question: "How do you profile a Node.js application for CPU bottlenecks?", answer: "By running node with the --prof flag to generate a V8 tick file, or by using the built-in inspector and Chrome DevTools." }
    ],
    practicalTask: {
      scenario: "Testing an asynchronous function.",
      task: "Write a simple Jest test for a function returning a Promise.",
      solutionCode: "test('async func', async () => {\n  const data = await Promise.resolve('hello');\n  expect(data).toBe('hello');\n});"
    }
  },
  {
    slug: "node-native-addons-p6",
    title: "29. Building Native Addons with N-API",
    order: 29,
    content: `<h2>Integrating C/C++ into Node.js</h2>
<p>When JavaScript isn't fast enough, or when you need to interface with legacy hardware/libraries, you can write native addons in C or C++. Node-API (formerly N-API) is the modern, ABI-stable C API for building native addons.</p>
<h3>Node-API (N-API)</h3>
<p>Unlike the old V8 API (NAN), N-API guarantees Application Binary Interface (ABI) stability. This means an addon compiled for Node v14 will still run on Node v18 without recompilation.</p>
<pre><code>// Example snippet of N-API C code
#include &lt;node_api.h&gt;

napi_value Method(napi_env env, napi_callback_info info) {
  napi_value greeting;
  napi_create_string_utf8(env, "hello world", NAPI_AUTO_LENGTH, &greeting);
  return greeting;
}
</code></pre>
<h3>node-gyp</h3>
<p>Native addons are compiled using <code>node-gyp</code>, a cross-platform command-line tool written in Node.js for compiling native addon modules. It requires Python and a C++ compiler (like GCC or Visual Studio) to be installed on the host machine.</p>`,
    interviewQuestions: [
      { question: "What is the primary benefit of Node-API (N-API) over earlier C++ APIs like NAN?", answer: "ABI stability. Addons compiled with N-API do not need to be recompiled when upgrading the Node.js version." },
      { question: "What is node-gyp?", answer: "A tool used to compile native C++ addons for Node.js. It bridges the gap between different OS build systems." },
      { question: "Why would you choose to write a native addon instead of using Worker Threads?", answer: "To bind to an existing system C/C++ library (like image processing or hardware drivers) or to achieve absolute maximum performance beyond V8's capabilities." },
      { question: "What does it mean for N-API to be ABI-stable?", answer: "The compiled binary interface remains consistent across Node versions, preventing module breakage during runtime engine updates." },
      { question: "Can WebAssembly (Wasm) replace native C++ addons?", answer: "In many cases, yes. Wasm provides near-native speeds and is sandboxed, making it safer and easier to distribute than compiled OS-specific binaries." }
    ],
    practicalTask: {
      scenario: "Setting up a native build.",
      task: "Create a basic binding.gyp file structure.",
      solutionCode: "{\n  \"targets\": [\n    { \"target_name\": \"addon\", \"sources\": [ \"addon.cc\" ] }\n  ]\n}"
    }
  },
  {
    slug: "node-deployment-k8s-p6",
    title: "30. Deployment, Containerization, and K8s Scaling",
    order: 30,
    content: `<h2>Taking Node.js to Production</h2>
<p>Deploying Node.js manually via PM2 or raw SSH is outdated. Modern deployments rely on immutable container images orchestrated by Kubernetes.</p>
<h3>Dockerizing Node.js</h3>
<p>A multi-stage Dockerfile ensures that production images are lightweight and do not contain development dependencies. Best practices include running as a non-root user and avoiding PID 1 issues.</p>
<pre><code># Multi-stage Docker build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
USER node
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
CMD ["node", "dist/index.js"]
</code></pre>
<h3>Kubernetes (K8s) Integration</h3>
<p>Kubernetes manages the deployment, scaling, and auto-healing of these containers. A Node.js pod should expose health endpoints (e.g., <code>/healthz</code>) so K8s Liveness and Readiness probes know when the app is ready to receive traffic or needs to be restarted.</p>`,
    interviewQuestions: [
      { question: "Why should you use a multi-stage Docker build for Node.js?", answer: "It allows you to compile/build your code using devDependencies, but only copy the compiled artifacts and production dependencies into the final image, reducing size and attack surface." },
      { question: "Why shouldn't Node.js run as PID 1 in a Docker container?", answer: "Node.js isn't designed to be an init system. It doesn't handle OS signals (like SIGINT) optimally when run as PID 1, preventing graceful shutdowns. Use 'dumb-init' or 'tini'." },
      { question: "What is the difference between a Liveness probe and a Readiness probe in Kubernetes?", answer: "Liveness probe determines if the container is running; if it fails, K8s restarts it. Readiness probe determines if it can accept traffic; if it fails, K8s stops sending requests to it." },
      { question: "Why should you run the Node.js process as a non-root user in Docker?", answer: "Security. If an attacker breaches the Node process, being root inside the container makes it easier to perform container escape attacks to the host machine." },
      { question: "What is PM2, and is it needed in Kubernetes?", answer: "PM2 is a process manager for Node.js. In Kubernetes, it is generally anti-pattern because K8s itself acts as the process manager, handling crashes and restarts." }
    ],
    practicalTask: {
      scenario: "Preparing for K8s deployment.",
      task: "Write an Express route for a health check probe.",
      solutionCode: "app.get('/healthz', (req, res) => res.status(200).send('OK'));"
    }
  }
];

appendTopics('nodejs', 'Node.js Enterprise Backend', 'The definitive guide.', topics);
