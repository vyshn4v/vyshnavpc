import { appendQuestions } from "./appendQuestions.js";

const advancedQuestions = [
  {
    categoryName: "Advanced Architecture & Communication (gRPC vs REST)",
    questions: [
      {
        difficulty: "Expert",
        question: "Explain how gRPC handles connection multiplexing over HTTP/2 compared to a standard REST API over HTTP/1.1, and what specific edge cases arise when terminating TLS at a Layer 4 vs Layer 7 load balancer.",
        expectedAnswer: "gRPC uses HTTP/2 for multiplexing multiple streams over a single TCP connection, reducing latency. When terminating TLS at Layer 4, the LB passes raw TCP, meaning the backend must handle TLS and HTTP/2. At Layer 7, the LB terminates TLS and must explicitly support HTTP/2 backend connections (gRPC), otherwise it downgrades to HTTP/1.1, breaking gRPC. Layer 7 is required for routing based on gRPC paths.",
        redFlags: ["Thinking HTTP/2 multiplexing works out-of-the-box on standard HTTP/1.1 proxies.", "Not understanding the difference between L4 and L7 balancing for gRPC."],
        bonusPoints: ["Mentioning Envoy proxy or specifically configuring Nginx/HAProxy for gRPC."]
      },
      {
        difficulty: "Expert",
        question: "How would you handle a scenario where a gRPC bidirectional stream experiences silent connection drops from an intermediate NAT firewall, and how does this differ from REST?",
        expectedAnswer: "In gRPC, bidirectional streams can remain open indefinitely. Firewalls drop idle TCP connections without sending FIN/RST packets. To solve this, gRPC requires implementing Keep-Alive pings (HTTP/2 PING frames). REST typically uses short-lived requests, or WebSockets which also require application-level ping/pong mechanisms to keep NAT state active.",
        redFlags: ["Suggesting client-side retries alone without addressing the idle connection timeout.", "Not knowing about HTTP/2 Keep-Alive mechanisms."],
        bonusPoints: ["Mentioning TCP keep-alive tuning at the OS level as a secondary fallback."]
      },
      {
        difficulty: "Expert",
        question: "If you need to stream a massive 10GB file from a client to a server, detail the architectural differences, memory overhead, and backpressure handling between using REST (multipart/form-data) vs gRPC streaming.",
        expectedAnswer: "In REST, streaming requires chunked transfer encoding; backpressure relies on TCP window sizes, which can be blunt. In gRPC, client streaming uses HTTP/2 flow control at the stream level, providing fine-grained backpressure without blocking other streams on the same connection. Memory overhead is lower in gRPC due to Protobuf's binary format compared to parsing multipart boundaries.",
        redFlags: ["Suggesting reading the entire file into memory before sending.", "Not mentioning HTTP/2 flow control in gRPC."],
        bonusPoints: ["Explaining how Protobuf chunking works and defining maximum message sizes (MaxCallRecvMsgSize)."]
      }
    ]
  },
  {
    categoryName: "Node.js V8 Engine & Memory Management",
    questions: [
      {
        difficulty: "Expert",
        question: "You have a memory leak in a Node.js production service. A heap snapshot shows a massive Retained Size but a small Shallow Size for an array of closures. Explain what is happening and how V8's context allocation causes this.",
        expectedAnswer: "The Shallow Size is small because the closures themselves take little memory, but they retain large objects via scope (Retained Size). V8 allocates variables used in closures to a 'Context' object on the heap. If multiple closures share the same lexical environment, a large object referenced by one closure prevents garbage collection of the entire Context, leaking memory even if the referencing closure is never called.",
        redFlags: ["Confusing Shallow and Retained sizes.", "Not understanding lexical scope and V8 Context objects."],
        bonusPoints: ["Mentioning 'eval' or the 'new Function' edge cases.", "Discussing how to use Chrome DevTools to trace the retainer tree."]
      },
      {
        difficulty: "Expert",
        question: "Your Node.js API experiences severe latency spikes every few minutes. Tracing reveals it's caused by the V8 Garbage Collector's Mark-Sweep phase. How do you optimize the application to reduce Old Space GC pauses?",
        expectedAnswer: "Latency spikes from Mark-Sweep mean the Old Space is filling up with long-lived objects, triggering a full, blocking GC cycle. Optimizations include: 1) Reducing object allocations to keep them in New Space (Scavenger GC, which is fast), 2) Increasing `--max-old-space-size`, or 3) Reusing objects (Object Pooling). Avoid caching large data structures in memory; use Redis instead.",
        redFlags: ["Suggesting calling global.gc() manually.", "Not distinguishing between Minor (Scavenger) and Major (Mark-Sweep) GC."],
        bonusPoints: ["Mentioning V8's concurrent marking and how heavy CPU load delays it."]
      },
      {
        difficulty: "Expert",
        question: "A Node.js service using a C++ image processing addon is crashing with OOM, but V8 heap snapshots show memory usage is well under the limit. How do you diagnose and fix this?",
        expectedAnswer: "This is an unmanaged memory leak outside the V8 heap, likely in the C++ addon or Buffer objects (which are allocated off-heap). To diagnose, use OS-level tools like `top`, `valgrind`, or `jemalloc` profiling. To fix, ensure the C++ addon explicitly frees memory or binds the lifecycle of off-heap memory to a V8 object using `Napi::Buffer` or `napi_add_finalizer` so V8 GC can trigger the cleanup.",
        redFlags: ["Relying solely on Node.js heap snapshots.", "Assuming V8's GC automatically manages C++ pointers."],
        bonusPoints: ["Mentioning `process.memoryUsage().rss` vs `heapUsed` to identify off-heap leaks."]
      }
    ]
  },
  {
    categoryName: "Concurrency & Scalability (Clustering & Worker Threads)",
    questions: [
      {
        difficulty: "Expert",
        question: "When using the Node.js `cluster` module, explain the bottlenecks of IPC (Inter-Process Communication) and why it's a bad idea to use `process.send()` for high-frequency, large payload synchronization between workers.",
        expectedAnswer: "IPC in Node uses Unix Domain Sockets or named pipes. `process.send()` serializes data to JSON (or internal format) and deserializes it on the receiving end. This serialization/deserialization blocks the event loop and has a high CPU cost. High-frequency or large payloads will saturate the IPC channel, causing immense latency. Redis or a shared datastore is better for worker synchronization.",
        redFlags: ["Assuming `process.send` uses shared memory.", "Not mentioning the JSON serialization overhead."],
        bonusPoints: ["Suggesting `Worker Threads` with `SharedArrayBuffer` for true shared memory instead of `cluster`."]
      },
      {
        difficulty: "Expert",
        question: "You need to perform heavy matrix multiplication in Node.js. Compare using Worker Threads with `SharedArrayBuffer` vs spawning child processes. What are the synchronization risks?",
        expectedAnswer: "Worker Threads run in the same process and can use `SharedArrayBuffer` to avoid data serialization (zero-copy), making it much faster for matrix math. Child processes require IPC serialization. The risk of `SharedArrayBuffer` is race conditions; developers must use `Atomics` (like `Atomics.wait` and `Atomics.add`) to safely synchronize memory access, which is complex and error-prone.",
        redFlags: ["Thinking Worker Threads bypass the V8 engine entirely.", "Failing to mention `Atomics` for thread safety."],
        bonusPoints: ["Discussing memory isolation in V8 Isolates and how Worker Threads utilize them."]
      },
      {
        difficulty: "Expert",
        question: "In a clustered Node.js application, each worker creates its own database connection pool. If you have 40 pods, each with 4 workers, and a pool size of 20, you overwhelm the database with 3200 connections. How do you architect a solution to this?",
        expectedAnswer: "To prevent connection exhaustion, implement a centralized connection proxy like PgBouncer for PostgreSQL, use a sidecar container to multiplex connections, or transition to a serverless/connectionless architecture using an API gateway (e.g., Prisma Data Proxy). Alternatively, drastically reduce the per-worker pool size, since Node handles concurrent queries asynchronously anyway.",
        redFlags: ["Suggesting workers share a single connection object via IPC (impossible).", "Not calculating the multiplicative effect of horizontal scaling on connections."],
        bonusPoints: ["Mentioning multiplexing or connection pooling at the infrastructure level rather than application level."]
      },
      {
        difficulty: "Expert",
        question: "An application uses Worker Threads to offload a CPU-heavy task. The main thread sends tasks to workers via `worker.postMessage()`. Suddenly, the main thread's event loop blocks. What likely caused this?",
        expectedAnswer: "The event loop blocked because `postMessage` uses the structured clone algorithm to copy the data. If the main thread sends a massive, deeply nested object, the serialization process itself blocks the main thread's event loop before the worker even starts. The solution is to use `Transferable Objects` (like `ArrayBuffer` or `MessagePort`) to transfer ownership without copying.",
        redFlags: ["Assuming workers magically prevent main thread blocking in all scenarios.", "Not knowing about structured cloning overhead."],
        bonusPoints: ["Explaining how `Transferable Objects` zero-out the reference in the main thread for performance."]
      }
    ]
  },
  {
    categoryName: "Advanced Security (OAuth2 & JWT)",
    questions: [
      {
        difficulty: "Expert",
        question: "Explain the race condition that occurs during JWT Refresh Token Rotation when a client fires multiple concurrent API requests. How do you solve it without forcing the user to log out?",
        expectedAnswer: "In rotation, using a refresh token invalidates it and issues a new one. Concurrent requests might trigger multiple refresh attempts simultaneously; the first succeeds, but subsequent ones use the old token and fail (or trigger theft-detection, revoking all tokens). The solution is a 'grace period' on the backend where a recently used refresh token remains valid for a few seconds, or returning the already-generated new token for concurrent requests.",
        redFlags: ["Suggesting locking the client UI to prevent concurrent requests (doesn't solve network latency/retries).", "Disabling token rotation entirely."],
        bonusPoints: ["Explaining Redis-based locking mechanisms to handle distributed token refresh requests."]
      },
      {
        difficulty: "Expert",
        question: "Describe the 'Backend-for-Frontend' (BFF) pattern in the context of OAuth2. Why is it considered more secure than the standard Authorization Code Flow with PKCE for Single Page Applications?",
        expectedAnswer: "In a BFF pattern, the SPA never handles or sees the OAuth2 tokens. The BFF (a server-side component) handles the Authorization Code exchange and stores the Access/Refresh tokens in a secure, HttpOnly, SameSite cookie. This eliminates the risk of XSS attacks stealing the tokens from local storage or memory in the browser. PKCE in SPAs still leaves tokens accessible to JavaScript.",
        redFlags: ["Thinking PKCE prevents XSS.", "Confusing BFF with an API Gateway."],
        bonusPoints: ["Mentioning SameSite=Strict cookies and anti-CSRF tokens used alongside the BFF."]
      },
      {
        difficulty: "Expert",
        question: "How do you implement a 'Split Token' architecture to mitigate both XSS and CSRF attacks simultaneously for an API consumed by a web browser?",
        expectedAnswer: "Split Token divides the JWT into two parts. The signature is stored in an HttpOnly, Secure cookie (immune to XSS). The header/payload is sent to the client and stored in memory/localStorage (immune to CSRF). On requests, the client sends the payload via the Authorization header, and the browser automatically sends the cookie. The backend concatenates them to verify. An attacker needs both XSS and CSRF to steal the session.",
        redFlags: ["Storing the entire JWT in localStorage.", "Not understanding how CSRF exploits cookie auto-inclusion."],
        bonusPoints: ["Mentioning that modern SameSite=Lax/Strict cookies largely mitigate CSRF, making split tokens less common but highly secure."]
      },
      {
        difficulty: "Expert",
        question: "An attacker intercepts a valid JWT and replays the request to a sensitive endpoint multiple times before the token expires. How do you prevent Replay Attacks using JWT claims?",
        expectedAnswer: "Use the `jti` (JWT ID) claim to assign a unique identifier to the token. The backend must store the `jti` of used tokens in a fast cache (like Redis) until the token's expiration (`exp`). If a request comes in with a `jti` that exists in the cache, it's a replay attack and is rejected. This makes the token single-use or tracks specific non-idempotent operations.",
        redFlags: ["Suggesting reducing the token lifespan as the primary solution (doesn't prevent immediate replay).", "Storing all valid tokens in a database (defeats the stateless purpose of JWT)."],
        bonusPoints: ["Discussing the use of nonces and timestamp validations (iat) in conjunction with jti."]
      },
      {
        difficulty: "Expert",
        question: "In a microservices architecture, Service A calls Service B on behalf of a user. If Service A's access token is compromised, an attacker can access Service B. How do you prevent this lateral movement using OAuth2 Token Exchange (RFC 8693)?",
        expectedAnswer: "Instead of simply passing the original user's token downstream, Service A uses OAuth2 Token Exchange to trade the incoming token for a new, highly scoped token specifically for Service B. This new token has restricted audiences (`aud`) and scopes. If Service A is compromised, the attacker cannot use its tokens to arbitrarily access Service C or D, as the tokens are bound to specific service-to-service paths.",
        redFlags: ["Using the same monolithic JWT for all microservices.", "Implementing custom, non-standard token generation between services."],
        bonusPoints: ["Mentioning Mutual TLS (mTLS) alongside token exchange for defense-in-depth."]
      }
    ]
  }
];

async function run() {
  try {
    await appendQuestions('round-3', advancedQuestions);
    console.log("Successfully ran add-more-round-3 script");
    process.exit(0);
  } catch (error) {
    console.error("Failed to run:", error);
    process.exit(1);
  }
}

run();
