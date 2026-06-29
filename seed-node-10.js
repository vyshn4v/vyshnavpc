import { appendTopics } from "./seeder-utils.js";

const topics = [
  {
    slug: "performance-profiling-flame-graphs",
    title: "Performance Profiling & Flame Graphs",
    order: 46,
    content: `### 1. Conceptual Overview
Performance profiling is the process of analyzing an application's execution to identify bottlenecks, excessive memory usage, and CPU-intensive operations. In Node.js, profiling helps developers pinpoint slow functions and asynchronous operations that block the event loop. Flame graphs are a highly effective visualization tool that maps out the stack traces of an application over time, allowing developers to immediately see where the application spends the majority of its CPU cycles.

### 2. Architecture & Mechanics
Node.js comes with built-in V8 profiling tools. When run with the \`--prof\` flag, the V8 engine generates a tick file containing statistical sampling data of the JavaScript and C++ execution stacks. These files can be processed into a human-readable format or converted into flame graphs. A flame graph plots the call stack along the Y-axis and CPU time along the X-axis. The width of a block indicates the total time spent in a function, making it easy to spot "hot" code paths. Modern tools like Clinic.js (specifically Clinic Flame) provide advanced interfaces to trace, visualize, and analyze this data natively.

### 3. Implementation: Standard vs Optimized
**Standard Implementation (V8 Profiler):**
Running the app with basic V8 profiling and interpreting the text output.
\`\`\`bash
node --prof app.js
# Generates an isolate-0x...-v8.log file
node --prof-process isolate-0x...-v8.log > processed.txt
\`\`\`
This produces a massive text file that is tedious to analyze manually.

**Optimized Implementation (Using Clinic.js Flame):**
Clinic.js automates the profiling process and generates an interactive HTML flame graph.
\`\`\`bash
npm install -g clinic
clinic flame -- node app.js
\`\`\`
This launches the app, collects profiling data, and automatically opens a browser window displaying an intuitive flame graph, significantly reducing the time required to identify performance issues.

### 4. Trade-offs & Complexity
Profiling inherently adds overhead to the application. Running profiling tools in production can significantly degrade performance and is generally discouraged unless using low-overhead sampling profilers. While flame graphs provide a high-level view of CPU usage, they do not inherently explain *why* a function is slow (e.g., waiting on I/O vs pure computation). Developers must possess a solid understanding of the V8 engine and the Node.js event loop to accurately interpret the generated graphs and distinguish between synchronous bottlenecks and expected asynchronous delays.`,
    interviewQuestions: [
      {
        question: "What is a flame graph in the context of Node.js profiling?",
        answer: "A flame graph is a visualization of hierarchical data, commonly used to represent CPU usage of a Node.js application over time. The x-axis shows the population percentage (time spent), and the y-axis shows the stack depth."
      },
      {
        question: "How does the V8 profiler collect data?",
        answer: "The V8 profiler collects data via statistical sampling. It periodically interrupts the execution to record the current call stack, which is then used to estimate where the application spends most of its time."
      },
      {
        question: "Why should you avoid running full profiling in a production environment?",
        answer: "Full profiling adds significant performance overhead, slowing down the application and potentially altering the very performance characteristics you are trying to measure. It can also consume large amounts of disk space for log files."
      },
      {
        question: "What does a wide block at the top of a flame graph indicate?",
        answer: "A wide block at the top of a flame graph represents a function that is directly consuming a large amount of CPU time (it is 'on CPU' frequently), indicating a potential performance bottleneck."
      },
      {
        question: "What is Clinic.js?",
        answer: "Clinic.js is a suite of tools for diagnosing and pinpointing Node.js performance issues. It includes tools like Clinic Doctor, Clinic Flame, and Clinic Bubbleprof to visualize different aspects of application performance."
      }
    ],
    practicalTask: {
      scenario: "Your application has a CPU-intensive route that calculates primes, blocking the event loop.",
      task: "Write a script that uses a highly inefficient prime calculation function, which would show up clearly as a bottleneck on a flame graph.",
      solutionCode: `const http = require('http');

function isPrime(num) {
  for(let i = 2, s = Math.sqrt(num); i <= s; i++)
    if(num % i === 0) return false; 
  return num > 1;
}

function nthPrime(n) {
  let count = 0;
  let num = 2;
  while(count < n) {
    if(isPrime(num)) count++;
    num++;
  }
  return num - 1;
}

const server = http.createServer((req, res) => {
  if (req.url === '/compute') {
    // Highly synchronous and CPU intensive
    const result = nthPrime(10000); 
    res.end(\`Result: \${result}\`);
  } else {
    res.end('Hello');
  }
});

server.listen(3000, () => console.log('Server running on port 3000'));`
    }
  },
  {
    slug: "advanced-memory-management-leak-detection",
    title: "Advanced Memory Management & Leak Detection",
    order: 47,
    content: `### 1. Conceptual Overview
Memory management in Node.js is handled automatically by the V8 JavaScript engine's garbage collector. However, developers can still introduce memory leaks by maintaining unintended references to objects, preventing the garbage collector from freeing them. Advanced memory management involves understanding the generational garbage collection mechanism (New Space and Old Space) and proactively monitoring, detecting, and resolving memory leaks to ensure long-running applications remain stable.

### 2. Architecture & Mechanics
V8 divides the heap into several spaces, primarily the "New Space" (for short-lived objects) and "Old Space" (for long-lived objects). Garbage collection (GC) operates differently in these spaces: a minor GC runs frequently to clean up the New Space quickly, while a major GC runs less frequently to clean up the Old Space using a Mark-Sweep-Compact algorithm. Memory leaks often occur when objects in the Old Space continue to grow unbounded (e.g., caching without eviction policies, unremoved event listeners, or closures trapping variables). Heap snapshots can be taken to inspect the memory graph and identify these lingering objects.

### 3. Implementation: Standard vs Optimized
**Standard Implementation (Manual Inspection):**
Periodically logging memory usage using \`process.memoryUsage()\`.
\`\`\`javascript
setInterval(() => {
  const usage = process.memoryUsage();
  console.log(\`Heap Used: \${Math.round(usage.heapUsed / 1024 / 1024)} MB\`);
}, 10000);
\`\`\`
This only indicates *if* memory is growing, not *why*.

**Optimized Implementation (Heap Snapshots & Profiling):**
Using the built-in \`v8\` module to capture heap snapshots programmatically when memory exceeds a threshold, or using Chrome DevTools for interactive analysis.
\`\`\`javascript
const v8 = require('v8');
const fs = require('fs');

function takeSnapshot() {
  const snapshotStream = v8.getHeapSnapshot();
  const fileName = \`\${Date.now()}.heapsnapshot\`;
  const fileStream = fs.createWriteStream(fileName);
  snapshotStream.pipe(fileStream);
  console.log(\`Snapshot saved to \${fileName}\`);
}
\`\`\`
These \`.heapsnapshot\` files can be loaded into Chrome DevTools to compare snapshots over time, showing exactly which objects are accumulating and their retaining paths.

### 4. Trade-offs & Complexity
Taking a heap snapshot is a blocking operation; it pauses the entire Node.js application, which can cause significant latency spikes or timeouts in a production environment. Therefore, snapshots should only be taken sparingly or in controlled staging environments. Analyzing heap snapshots is also a complex skill requiring an understanding of V8's internal structures (like hidden classes and retaining trees). Developers must balance the need for deep memory visibility against the operational impact of gathering that data.`,
    interviewQuestions: [
      {
        question: "What is the difference between New Space and Old Space in V8 memory management?",
        answer: "New Space is where objects are initially allocated and is designed for short-lived objects. It is collected frequently. Old Space holds objects that have survived multiple garbage collections in the New Space and is collected less frequently."
      },
      {
        question: "What causes a memory leak in a garbage-collected language like JavaScript?",
        answer: "A memory leak occurs when the application retains references to objects that are no longer needed, preventing the garbage collector from identifying them as unreachable and freeing their memory."
      },
      {
        question: "How can closures inadvertently cause memory leaks?",
        answer: "If a closure references a large object or variable from its outer scope, and the closure itself is kept alive (e.g., via an event listener or a global array), the entire outer scope environment may be retained in memory."
      },
      {
        question: "What is a retaining path in the context of heap snapshots?",
        answer: "The retaining path is the chain of references from the GC root to a specific object. It shows exactly which variables, arrays, or object properties are keeping the object alive in memory."
      },
      {
        question: "Why shouldn't you frequently take heap snapshots in production?",
        answer: "Taking a heap snapshot blocks the main thread completely while V8 traverses the entire memory graph and writes it to disk, leading to severe latency and application unresponsiveness."
      }
    ],
    practicalTask: {
      scenario: "You need to demonstrate a common memory leak caused by an unbounded cache array.",
      task: "Create a simple HTTP server that leaks memory on every request by pushing large objects into a global array without ever clearing them.",
      solutionCode: `const http = require('http');

// Global cache acting as a memory leak source
const leakyCache = [];

const server = http.createServer((req, res) => {
  // Allocate a large string/object on each request
  const largeData = new Array(10000).fill('LeakData').join('');
  
  // Keep a reference to it in the global scope
  leakyCache.push({
    url: req.url,
    data: largeData,
    timestamp: Date.now()
  });

  res.end('Data cached... forever.');
});

server.listen(3000, () => {
  console.log('Server running on port 3000. Send requests to see memory grow.');
});`
    }
  },
  {
    slug: "native-cplusplus-addons-napi",
    title: "Native C++ Addons (N-API)",
    order: 48,
    content: `### 1. Conceptual Overview
Node.js allows developers to write Native Addons in C or C++ that can be loaded into Node.js using the \`require()\` function just like standard JavaScript modules. This is crucial for CPU-bound tasks, integrating with existing C/C++ libraries, or accessing low-level system APIs. Node-API (formerly N-API) is the modern standard for building native addons. It provides a stable C API that guarantees Application Binary Interface (ABI) stability across different versions of Node.js, meaning addons compiled for one version of Node.js will work on newer versions without recompilation.

### 2. Architecture & Mechanics
Native addons bridge the gap between JavaScript running in V8 and native system code. Historically, addons were written directly against the V8 API, which changed frequently, breaking addons across Node.js updates. Node-API provides an abstraction layer over V8. When a C++ addon is compiled (usually via \`node-gyp\`), it produces a \`.node\` shared library file. At runtime, when \`require('addon.node')\` is called, Node.js uses \`dlopen\` to load the shared library into the process memory space. The C++ code then interacts with JavaScript primitives (numbers, strings, objects) exclusively through Node-API functions.

### 3. Implementation: Standard vs Optimized
**Standard Implementation (Legacy V8 API):**
Writing addons using NAN (Native Abstractions for Node.js) or raw V8.
\`\`\`cpp
// Fragile, bound to specific V8 versions
#include <v8.h>
void Method(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(v8::String::NewFromUtf8(isolate, "world"));
}
\`\`\`
This requires recompilation whenever a new major Node.js version is released.

**Optimized Implementation (Node-API / node-addon-api):**
Using the \`node-addon-api\` C++ wrapper over N-API for ABI stability.
\`\`\`cpp
#include <napi.h>

Napi::String Method(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "world");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "hello"), Napi::Function::New(env, Method));
  return exports;
}
NODE_API_MODULE(addon, Init)
\`\`\`
This modern approach ensures that the compiled \`.node\` binary will continue to work seamlessly across future Node.js upgrades.

### 4. Trade-offs & Complexity
Writing native addons introduces immense complexity. Developers must manage memory manually in C++ (avoiding memory leaks and segmentation faults), which negates the safety of JavaScript's garbage collector. Crossing the boundary between JavaScript and C++ carries a performance overhead; therefore, native addons are only beneficial if the time saved by running optimized C++ code outweighs the cost of the context switch. Furthermore, native addons complicate deployment, as they must be compiled for the specific target operating system and architecture (e.g., Windows x64 vs Linux ARM).`,
    interviewQuestions: [
      {
        question: "What is Node-API (N-API)?",
        answer: "Node-API is a C API for building native addons. It provides Application Binary Interface (ABI) stability across Node.js versions, meaning addons don't need to be recompiled when the underlying V8 JavaScript engine changes."
      },
      {
        question: "Why might you choose to write a native C++ addon instead of using plain JavaScript?",
        answer: "Native addons are used for highly CPU-intensive computations where JavaScript is too slow, or to interface directly with existing legacy C/C++ libraries and operating system APIs."
      },
      {
        question: "What is the role of `node-gyp` in native addon development?",
        answer: "`node-gyp` is a cross-platform command-line tool written in Node.js for compiling native addon modules for Node.js. It generates platform-specific project build files (like Makefiles or Visual Studio projects)."
      },
      {
        question: "What is the performance cost of calling a C++ addon from JavaScript?",
        answer: "There is an overhead involved in crossing the boundary between V8 JavaScript and C++, primarily due to the need to marshal data types between the two environments. Addons are only faster if the computation inside C++ outweighs this serialization cost."
      },
      {
        question: "How does memory management differ between Node.js and a C++ addon?",
        answer: "Node.js relies on an automatic garbage collector, whereas in C++, developers must explicitly allocate and free memory. Memory leaks in the C++ layer will not be resolved by the Node.js garbage collector."
      }
    ],
    practicalTask: {
      scenario: "You need a basic binding.gyp file configuration to compile a node-addon-api project.",
      task: "Write the content of a binding.gyp file that includes the node-addon-api headers and disables C++ exceptions (a common optimization).",
      solutionCode: `{
  "targets": [
    {
      "target_name": "myaddon",
      "sources": [ "myaddon.cpp" ],
      "include_dirs": [
        "<!@(node -p \\"require('node-addon-api').include\\")"
      ],
      "dependencies": [
        "<!(node -p \\"require('node-addon-api').gyp\\")"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ]
    }
  ]
}`
    }
  },
  {
    slug: "nodejs-security-best-practices",
    title: "Node.js Security Best Practices at Scale",
    order: 49,
    content: `### 1. Conceptual Overview
As Node.js applications scale to handle massive traffic and sensitive data, security becomes paramount. A comprehensive security posture goes beyond just writing safe code; it encompasses dependency management, environment configuration, secure communication, and protection against common web vulnerabilities (like XSS, CSRF, and Injection attacks). In an enterprise context, adopting defense-in-depth principles ensures that if one layer of security fails, others remain to mitigate the threat.

### 2. Architecture & Mechanics
Node.js security operates on multiple architectural levels. At the application layer, middleware architectures (like Express or Fastify plugins) are used to sanitize inputs, enforce rate limits, and set secure HTTP headers. At the runtime layer, Node.js provides features like the experimental permission model (\`--experimental-permission\`) to restrict file system and network access. At the ecosystem layer, continuous auditing of the \`node_modules\` dependency tree is required, as a vast majority of a modern Node.js application's codebase consists of third-party open-source packages.

### 3. Implementation: Standard vs Optimized
**Standard Implementation (Basic Middleware):**
Applying basic protections manually, which is prone to oversight.
\`\`\`javascript
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'My Custom Server'); // Weak attempt at obfuscation
  next();
});
\`\`\`
This approach fails to address the multitude of HTTP security headers required by modern browsers.

**Optimized Implementation (Hardened Configuration):**
Using established security libraries and built-in audit tools to systematically harden the application.
\`\`\`javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Automatically sets 11 secure HTTP headers
app.use(helmet());

// Throttles requests to prevent Brute Force and DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
\`\`\`
Additionally, running \`npm audit --audit-level=high\` in CI/CD pipelines ensures known vulnerabilities in dependencies prevent the build from passing.

### 4. Trade-offs & Complexity
Security measures inherently introduce friction and complexity. Rate limiting might accidentally block legitimate users behind a shared NAT/VPN. Strict Content Security Policies (CSP) configured via Helmet can break third-party analytics or external script integrations if not carefully maintained. Keeping dependencies constantly updated to patch security vulnerabilities requires dedicated maintenance time and risks introducing breaking changes. Organizations must balance rigorous security postures with operational agility and user experience.`,
    interviewQuestions: [
      {
        question: "What is the purpose of the `helmet` package in a Node.js application?",
        answer: "Helmet is a collection of middleware functions that help secure Node.js applications by setting various HTTP headers, such as Content Security Policy (CSP), X-Frame-Options, and Strict-Transport-Security (HSTS)."
      },
      {
        question: "How does a ReDoS (Regular Expression Denial of Service) attack work in Node.js?",
        answer: "ReDoS exploits poorly crafted regular expressions that have exponential time complexity. By feeding the regex a specific, long input string, an attacker can block the single-threaded event loop, rendering the server unresponsive."
      },
      {
        question: "Why is dependency auditing critical in the Node.js ecosystem?",
        answer: "Node.js applications typically rely on thousands of third-party packages from npm. If a vulnerability is discovered in any deep dependency, the entire application may be compromised. Auditing tools (like npm audit) track and report these known flaws."
      },
      {
        question: "What is the purpose of the `--experimental-permission` flag introduced in recent Node.js versions?",
        answer: "It allows developers to restrict what resources a Node.js process can access at runtime, such as limiting file system read/write access to specific directories or restricting child process creation, mitigating the impact of compromised code."
      },
      {
        question: "How should sensitive configuration secrets (like database passwords) be handled in Node.js?",
        answer: "Secrets should never be hardcoded in the repository. They should be injected via environment variables (`process.env`), ideally sourced from a secure vault or secret management service in production environments."
      }
    ],
    practicalTask: {
      scenario: "You are hardening an Express API against basic brute-force attacks.",
      task: "Set up the `express-rate-limit` middleware to restrict clients to 50 requests per hour.",
      solutionCode: `const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again after an hour'
});

// Apply the rate limiting middleware to API calls only
app.use('/api/', apiLimiter);

app.get('/api/data', (req, res) => {
  res.json({ message: 'Secure data accessed' });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});`
    }
  },
  {
    slug: "deploying-microservices-kubernetes-docker",
    title: "Deploying Node.js Microservices using Kubernetes & Docker",
    order: 50,
    content: `### 1. Conceptual Overview
Deploying Node.js applications has evolved from running background processes on a single VM (using PM2 or Forever) to orchestrating containerized microservices. Docker packages the Node.js application alongside its runtime and dependencies into a portable, immutable image. Kubernetes (K8s) is a container orchestration platform that manages these Docker containers across clusters of machines, handling scaling, self-healing, load balancing, and zero-downtime deployments.

### 2. Architecture & Mechanics
In a containerized environment, the Node.js application is unaware of the host operating system. The \`Dockerfile\` defines the build steps—starting from a base Node.js image, copying package.json, installing dependencies, and exposing a port. Once the image is pushed to a registry, Kubernetes manifests (YAML files) define the desired state. A \`Deployment\` ensures a specified number of application replicas (pods) are running, while a \`Service\` provides stable networking to route traffic to those dynamic pods. Kubernetes continuously monitors the cluster; if a Node.js pod crashes (e.g., due to an Uncaught Exception), Kubernetes automatically provisions a replacement.

### 3. Implementation: Standard vs Optimized
**Standard Implementation (Basic Dockerfile):**
A naive Dockerfile that copies all files and runs as the root user.
\`\`\`dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
\`\`\`
This image is excessively large, includes development dependencies, and poses a security risk by running as root.

**Optimized Implementation (Multi-stage, Least Privilege):**
Using a multi-stage build to minimize image size, installing only production dependencies, and running as a non-root user.
\`\`\`dockerfile
# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production Stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
# Switch to secure non-root user provided by the node image
USER node
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`
This results in a hardened, lightweight container optimized for Kubernetes orchestration.

### 4. Trade-offs & Complexity
Adopting Docker and Kubernetes introduces a steep learning curve and immense operational complexity. Developers must manage YAML manifests, understand cluster networking, configure readiness and liveness probes, and implement centralized logging (since container logs are ephemeral). For simple monolithic applications, Kubernetes is often profound overkill, increasing infrastructure costs and deployment time. However, for large-scale microservice architectures requiring high availability, elastic scaling, and distributed team ownership, the robust automation provided by Kubernetes is invaluable.`,
    interviewQuestions: [
      {
        question: "Why should you use an 'alpine' based Node.js Docker image?",
        answer: "Alpine Linux images are significantly smaller in size compared to standard Debian-based images. This reduces image pull times, decreases cloud storage costs, and minimizes the security attack surface."
      },
      {
        question: "What is the importance of the `USER node` directive in a Node.js Dockerfile?",
        answer: "By default, Docker runs containers as the root user. Using `USER node` switches execution to a lower-privileged user, reducing the risk of an attacker gaining host system control if the container is compromised."
      },
      {
        question: "What is the difference between a Liveness Probe and a Readiness Probe in Kubernetes?",
        answer: "A Liveness probe determines if the Node.js application is alive; if it fails, Kubernetes kills and restarts the pod. A Readiness probe determines if the application is ready to accept traffic; if it fails, Kubernetes stops sending HTTP requests to it but doesn't kill it."
      },
      {
        question: "Why is PM2 generally not necessary when deploying Node.js in Kubernetes?",
        answer: "PM2 is a process manager designed to restart Node.js upon crashes and utilize multiple CPU cores on a single machine. In Kubernetes, the orchestration platform handles restarting crashed pods, and scaling is achieved horizontally by spinning up more single-process pods rather than clustering within one pod."
      },
      {
        question: "What does a multi-stage Docker build achieve for Node.js applications?",
        answer: "Multi-stage builds allow developers to compile code (like TypeScript or native addons) and install dev-dependencies in a 'builder' stage, and then copy only the final artifacts into a lean 'production' stage, resulting in a much smaller final image."
      }
    ],
    practicalTask: {
      scenario: "You need to create a Kubernetes Deployment manifest for a Node.js API.",
      task: "Write a simple Kubernetes Deployment YAML file that specifies 3 replicas of an image named `my-node-api:v1` and exposes port 8080.",
      solutionCode: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-api-deployment
  labels:
    app: node-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: node-api
  template:
    metadata:
      labels:
        app: node-api
    spec:
      containers:
      - name: node-api
        image: my-node-api:v1
        ports:
        - containerPort: 8080`
    }
  }
];

appendTopics('nodejs', 'Node.js Masterclass', '...', topics);
