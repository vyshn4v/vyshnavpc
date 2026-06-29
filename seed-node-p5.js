import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "node-memory-management-p5",
    title: "21. High-Performance Memory Management and GC",
    order: 21,
    content: `<h2>Understanding the V8 Heap</h2>
<p>In Node.js, JavaScript objects are stored in the V8 heap. The heap is divided into multiple spaces: the New Space (where objects are allocated initially) and the Old Space (where objects surviving garbage collection are moved).</p>
<h3>Garbage Collection (GC) Mechanisms</h3>
<p>V8 uses a Generational Garbage Collector. The "Scavenger" runs frequently in the New Space to quickly clear short-lived objects. A heavier "Mark-Sweep" and "Mark-Compact" collector runs periodically over the Old Space, causing brief pauses in execution (Stop-The-World).</p>
<pre><code>// Viewing memory usage
const used = process.memoryUsage();
for (let key in used) {
  console.log(\`\${key}: \${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB\`);
}
// Increasing heap size in Node
// node --max-old-space-size=4096 script.js
</code></pre>
<h3>Memory Leaks in Node.js</h3>
<p>Common causes include unbounded global variables, forgotten timers/intervals, unclosed event listeners, and caching without an eviction strategy. Tools like the Chrome DevTools Memory Profiler (via <code>--inspect</code>) are essential for tracking down leaks via heap snapshots.</p>`,
    interviewQuestions: [
      { question: "What is the difference between rss and heapTotal in process.memoryUsage()?", answer: "rss (Resident Set Size) is the total memory allocated for the process execution. heapTotal is the total size of the allocated heap." },
      { question: "How does V8's Scavenger garbage collector work?", answer: "It operates in the New Space using two semi-spaces. It copies alive objects from one semi-space to the other, discarding dead ones quickly." },
      { question: "What is a Memory Leak in a Garbage Collected language?", answer: "It occurs when references to objects are unintentionally held in memory (e.g. in a global array), preventing the GC from cleaning them up." },
      { question: "How can event listeners cause a memory leak?", answer: "If you repeatedly attach listeners to an emitter (like an HTTP server) without calling removeListener, those closures and their scopes stay in memory." },
      { question: "How do you generate a heap snapshot programmatically?", answer: "You can use the 'v8' module: require('v8').writeHeapSnapshot()." },
      { question: "What does the --max-old-space-size flag do?", answer: "It increases the maximum memory limit for the V8 Old Space, preventing Out-Of-Memory errors for memory-intensive applications." }
    ],
    practicalTask: {
      scenario: "Debugging an Out-Of-Memory exception.",
      task: "Write a script to log heap statistics.",
      solutionCode: "import v8 from 'v8';\nconsole.log(v8.getHeapStatistics());"
    }
  },
  {
    slug: "node-diagnostics-p5",
    title: "22. Advanced Error Handling & Diagnostics",
    order: 22,
    content: `<h2>Mastering Async Errors and Tracing</h2>
<p>Error handling in async code is notoriously tricky. Unhandled promise rejections have traditionally caused warnings but now crash the Node process by default. Structured error handling using custom Error classes is an enterprise requirement.</p>
<h3>Async Hooks</h3>
<p>The <code>async_hooks</code> module provides an API to track the lifetime of asynchronous resources created inside a Node.js application. It is heavily used in APM (Application Performance Monitoring) tools to trace execution context across async boundaries.</p>
<pre><code>import async_hooks from 'async_hooks';
import fs from 'fs';

const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    fs.writeSync(1, \`Init: \${type}(\${asyncId})\\n\`);
  }
});
hook.enable();
</code></pre>
<h3>Trace Events & Profiling</h3>
<p>Node.js has a built-in tracing facility. Running Node with <code>--trace-events-enabled</code> generates a log file that can be loaded into Chrome's <code>about:tracing</code> UI. This reveals exactly where the event loop is spending its time, down to the microsecond.</p>`,
    interviewQuestions: [
      { question: "Why should you never use process.on('uncaughtException') to resume execution?", answer: "Because the application is in an undefined state. Memory might be corrupted, and resources left hanging. You should log the error and gracefully exit." },
      { question: "What is the purpose of the async_hooks module?", answer: "To track the creation, execution, and destruction of asynchronous resources, allowing tools to maintain context across async boundaries." },
      { question: "How do you create a custom Error class in Node.js?", answer: "By extending the built-in Error class and capturing the stack trace using Error.captureStackTrace(this, this.constructor)." },
      { question: "What does the unhandledRejection event do?", answer: "It catches Promises that reject without a .catch() handler. Modern Node versions will terminate the process on this event by default." },
      { question: "What is AsyncLocalStorage?", answer: "A part of the async_hooks module that provides a way to store state continuously across asynchronous operations without passing it explicitly." }
    ],
    practicalTask: {
      scenario: "Maintaining context across async calls.",
      task: "Set up AsyncLocalStorage to store a transaction ID.",
      solutionCode: "import { AsyncLocalStorage } from 'async_hooks';\nconst als = new AsyncLocalStorage();\nals.run({ id: 123 }, () => {\n  setTimeout(() => console.log(als.getStore().id), 100);\n});"
    }
  },
  {
    slug: "node-security-crypto-p5",
    title: "23. Node.js Security: Threat Modeling and Cryptography",
    order: 23,
    content: `<h2>Securing the Backend</h2>
<p>Node.js backends are susceptible to standard web vulnerabilities like XSS, CSRF, and SQL Injection, but also specific threats like Prototype Pollution, ReDoS (Regular Expression Denial of Service), and arbitrary file execution.</p>
<h3>The Crypto Module</h3>
<p>Node.js wraps OpenSSL in its <code>crypto</code> module. You must use strong algorithms. For password hashing, never use standard SHA-256; use Scrypt, bcrypt (via native module), or Argon2. For symmetric encryption, AES-256-GCM is the modern standard because it is authenticated.</p>
<pre><code>import crypto from 'crypto';

// Hashing a password with scrypt
crypto.scrypt('myPassword', 'salt123', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));
});
</code></pre>
<h3>Preventing ReDoS and Prototype Pollution</h3>
<p>Prototype pollution happens when an attacker modifies <code>Object.prototype</code> via vulnerable recursive merge functions. ReDoS occurs when a poorly written regex takes exponential time to evaluate a crafted string, blocking the event loop entirely.</p>`,
    interviewQuestions: [
      { question: "Why is AES-GCM preferred over AES-CBC?", answer: "AES-GCM includes authentication (MAC), ensuring that the ciphertext has not been tampered with. CBC only encrypts." },
      { question: "What is Prototype Pollution in JavaScript?", answer: "A vulnerability where an attacker injects properties into Object.prototype, affecting all objects in the application." },
      { question: "How does a Regular Expression Denial of Service (ReDoS) attack work?", answer: "A complex regex with overlapping capture groups can be forced into catastrophic backtracking by a crafted payload, blocking the single thread." },
      { question: "Why should you use crypto.timingSafeEqual for comparing hashes/signatures?", answer: "Standard string comparison returns early on the first mismatched character, allowing an attacker to guess the string via timing attacks. timingSafeEqual takes constant time." },
      { question: "What is the purpose of the 'helmet' middleware in Express?", answer: "It sets various HTTP headers to secure the application against common vulnerabilities like XSS and Clickjacking." }
    ],
    practicalTask: {
      scenario: "Securely hashing data.",
      task: "Use the crypto module to generate a random 32-byte hex string.",
      solutionCode: "import crypto from 'crypto';\nconsole.log(crypto.randomBytes(32).toString('hex'));"
    }
  },
  {
    slug: "node-http2-grpc-p5",
    title: "24. Advanced HTTP/2 & gRPC Implementation in Node",
    order: 24,
    content: `<h2>Modern Transport Protocols</h2>
<p>HTTP/1.1 suffers from Head-of-Line blocking. HTTP/2 solves this by introducing multiplexing over a single TCP connection, server push, and header compression (HPACK). Node.js has a built-in <code>http2</code> module.</p>
<h3>Implementing HTTP/2</h3>
<pre><code>import http2 from 'http2';
import fs from 'fs';

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem')
});
server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html',
    ':status': 200
  });
  stream.end('&lt;h1&gt;Hello World&lt;/h1&gt;');
});
server.listen(8443);
</code></pre>
<h3>gRPC Architecture</h3>
<p>gRPC builds on top of HTTP/2 and uses Protocol Buffers (protobufs) instead of JSON. It allows defining strict typed contracts between microservices, leading to massive performance gains in serialization and deserialization compared to REST APIs.</p>`,
    interviewQuestions: [
      { question: "What are the primary benefits of HTTP/2 over HTTP/1.1?", answer: "Multiplexing (multiple requests per connection), binary framing, header compression, and server push." },
      { question: "What is gRPC and why is it used heavily in microservices?", answer: "It's an RPC framework by Google using HTTP/2 and Protobuf. It is faster, strictly typed, and supports bi-directional streaming natively." },
      { question: "Why does HTTP/2 require TLS in browsers?", answer: "The specification allows unencrypted HTTP/2, but no major browser supports it. Therefore, TLS is effectively mandatory for web clients." },
      { question: "What is Head-of-Line Blocking?", answer: "In HTTP/1.1, multiple requests over a single connection had to be answered in order. If the first takes long, the rest wait. HTTP/2 multiplexing fixes this." },
      { question: "How do Protocol Buffers compare to JSON?", answer: "Protobuf is a binary format, meaning it's smaller over the wire and faster to parse. However, it requires a predefined schema (.proto) to decode." }
    ],
    practicalTask: {
      scenario: "Setting up a modern secure server.",
      task: "Initialize an HTTP/2 server instance.",
      solutionCode: "import http2 from 'http2';\nconst server = http2.createServer();\nserver.listen(3000);"
    }
  },
  {
    slug: "node-websockets-realtime-p5",
    title: "25. WebSockets and Real-time Communication",
    order: 25,
    content: `<h2>Persistent Bi-directional Channels</h2>
<p>WebSockets provide a full-duplex communication channel over a single TCP connection. Unlike HTTP requests, the connection remains open, allowing the server to push data instantly.</p>
<h3>Scaling WebSockets</h3>
<p>Scaling WebSockets is inherently stateful. If you have multiple Node.js instances behind a load balancer, a client connected to Instance A cannot receive a message broadcast by Instance B. The solution is a Publish/Subscribe (Pub/Sub) system like Redis.</p>
<pre><code>import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });
  ws.send('something');
});
</code></pre>
<h3>Socket.io vs native WebSockets</h3>
<p>Socket.io is a library that wraps WebSockets, providing fallbacks (long polling) for older browsers, automatic reconnections, and namespaces/rooms. However, the native <code>ws</code> package is significantly faster and uses less memory if you don't need those features.</p>`,
    interviewQuestions: [
      { question: "How does a WebSocket connection begin?", answer: "It starts as a standard HTTP GET request with an 'Upgrade: websocket' header. The server responds with 101 Switching Protocols." },
      { question: "Why is horizontal scaling difficult with WebSockets?", answer: "Because connections are stateful. A load balancer might route a client to Server A, but Server B doesn't know about that connection." },
      { question: "How does Redis help in scaling WebSocket servers?", answer: "Using Redis Pub/Sub, when Server B needs to broadcast, it publishes a message to Redis. Server A subscribes, receives it, and pushes to its connected client." },
      { question: "What is the difference between Socket.io and standard WebSockets (ws)?", answer: "Socket.io is a framework offering auto-reconnect, rooms, and fallbacks. 'ws' is a barebones, high-performance WebSocket protocol implementation." },
      { question: "What are Server-Sent Events (SSE)?", answer: "A unidirectional protocol where the server streams updates over a standard HTTP connection. It's simpler than WebSockets if the client doesn't need to send data back." }
    ],
    practicalTask: {
      scenario: "Sending real-time data to clients.",
      task: "Create a basic WebSocket server that echoes messages back.",
      solutionCode: "import { WebSocketServer } from 'ws';\nnew WebSocketServer({ port: 8080 }).on('connection', ws => ws.on('message', msg => ws.send(msg)));"
    }
  }
];

appendTopics('nodejs', 'Node.js Enterprise Backend', 'The definitive guide.', topics);
