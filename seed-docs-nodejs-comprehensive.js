import { appendTopics } from "./seeder-utils.js";

const topics = [
  // ==================== TOPIC 1 ====================
  {
    slug: "intro-to-nodejs",
    title: "1. Introduction to Node.js",
    order: 1,
    content: `
# Introduction to Node.js

## What is Node.js?

Node.js is an **open-source, cross-platform JavaScript runtime environment** that executes JavaScript code outside a web browser. Built on Chrome's V8 JavaScript engine, it allows developers to use JavaScript for server-side programming.

### Key Features

- **Asynchronous & Event-Driven** — Non-blocking I/O model makes it efficient for real-time applications
- **Single-Threaded with Event Loop** — Handles thousands of concurrent connections with a single thread
- **npm Ecosystem** — The largest ecosystem of open-source libraries (npm)
- **Cross-Platform** — Runs on Windows, macOS, and Linux

### Where Node.js Excels

| Use Case | Why Node.js |
|----------|-------------|
| REST APIs | Fast I/O, lightweight, huge ecosystem |
| Real-time apps (chat, gaming) | WebSockets, event-driven |
| Microservices | Lightweight, fast startup |
| CLI tools | File system access, npm packaging |
| Streaming services | Native stream support |

## How Node.js Works

\`\`\`javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\\n");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
\`\`\`

## The require vs import Debate

\`\`\`javascript
// CommonJS (default in Node.js)
const fs = require("fs");
const { readFile } = require("fs");

// ES Modules (add "type": "module" to package.json)
import fs from "fs";
import { readFile } from "fs";
\`\`\`

## Global Objects

\`\`\`javascript
// Common globals
console.log(__dirname);    // Current directory path
console.log(__filename);   // Current file path
console.log(process);      // Current process info
console.log(global);       // Global object (like window in browser)
console.log(Buffer);       // Handle binary data
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What is Node.js and how does it differ from JavaScript in the browser?",
        answer: `Node.js is a **JavaScript runtime** built on Chrome's V8 engine that runs on the server. Key differences from browser JavaScript:

1. **Global object**: Node uses \`global\`, browsers use \`window\`.
2. **DOM API**: No DOM in Node (no document, window, etc.).
3. **File system**: Node has \`fs\` module for file I/O.
4. **Module system**: Node uses CommonJS (\`require\`) and ES Modules.
5. **Network**: Node has \`http\`, \`net\`, \`dgram\` for server-side networking.
6. **Process**: Node has \`process\` object for environment variables, CLI args, etc.

In essence, Node.js enables JavaScript to interact with the operating system — files, network, processes — which browsers restrict for security reasons.`
      },
      {
        question: "What is the event-driven, non-blocking I/O model in Node.js?",
        answer: `Node.js uses an **event-driven, non-blocking I/O model**:

1. **Non-blocking I/O**: When Node performs I/O (file read, database query, network request), it doesn't wait for the result. It registers a callback and continues executing other code.
2. **Event-driven**: When the I/O completes, an event is emitted, and the callback is queued for execution.
3. **Single thread**: JavaScript execution happens on one thread, but I/O operations are delegated to libuv's thread pool or the OS kernel.

This model allows Node to handle thousands of concurrent connections efficiently — it's not blocked waiting for any single operation to complete.`
      },
      {
        question: "What is the difference between CommonJS and ES Modules in Node.js?",
        answer: `**CommonJS** (CJS) is the default module system:
- Uses \`require()\` and \`module.exports\`
- Synchronous loading
- Can conditionally load modules (e.g., inside if blocks)
- File extension: \`.js\` or \`.cjs\`

**ES Modules** (ESM) is the modern standard:
- Uses \`import\` and \`export\`
- Static (statically analyzable)
- Top-level await support
- File extension: \`.mjs\` or \`.js\` with \`"type": "module"\` in package.json

Modern Node.js supports both. Use ESM for new projects, CJS for backward compatibility with older packages.`
      }
    ],
    practicalTask: {
      scenario: "You need to create a simple HTTP server that serves different responses based on the URL path. This is the foundation of any web API built with Node.js.",
      task: "Create an HTTP server using the 'http' module that: (1) listens on port 3000, (2) responds with 'Home Page' for '/', (3) responds with 'About Us' for '/about', (4) responds with 404 for all other paths, (5) logs each request method and URL to the console.",
      solutionCode: `const http = require("http");

const server = http.createServer((req, res) => {
  console.log(\`\${req.method} \${req.url}\`);

  res.writeHead(200, { "Content-Type": "text/plain" });

  if (req.url === "/") {
    res.end("Home Page");
  } else if (req.url === "/about") {
    res.end("About Us");
  } else {
    res.writeHead(404);
    res.end("404 Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});`
    }
  },
  // ==================== TOPIC 2 ====================
  {
    slug: "event-loop-deep",
    title: "2. The Event Loop Deep Dive",
    order: 2,
    content: `
# The Event Loop Deep Dive

## Understanding the Event Loop

The Event Loop is what makes Node.js asynchronous despite being single-threaded. It's a mechanism that takes callbacks from the task queues and pushes them onto the call stack.

## Phases of the Event Loop

\`\`\`
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
\`\`\`

## Phases Explained

1. **Timers**: Executes \`setTimeout\` and \`setInterval\` callbacks.
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next iteration.
3. **Idle, Prepare**: Internal use only.
4. **Poll**: Retrieves new I/O events, executes I/O callbacks. This is where Node blocks and waits.
5. **Check**: Executes \`setImmediate\` callbacks.
6. **Close Callbacks**: e.g., \`socket.on('close', ...)\`.

## Microtasks vs Macrotasks

Microtasks have higher priority than macrotasks. They are processed after each phase:

\`\`\`javascript
// Microtasks: process.nextTick, Promise callbacks
// Macrotasks: setTimeout, setInterval, setImmediate, I/O

console.log("1. Start");

setTimeout(() => console.log("2. setTimeout"), 0);
setImmediate(() => console.log("3. setImmediate"));

Promise.resolve().then(() => console.log("4. Promise"));
process.nextTick(() => console.log("5. nextTick"));

console.log("6. End");

// Output:
// 1. Start
// 6. End
// 5. nextTick (highest priority microtask)
// 4. Promise (microtask)
// 2. setTimeout (macrotask)
// 3. setImmediate (macrotask)
\`\`\`

## process.nextTick vs setImmediate

\`\`\`javascript
// process.nextTick fires BEFORE the next event loop iteration
// setImmediate fires AFTER the current poll phase

// Use nextTick for: deferring work but before I/O
// Use setImmediate for: deferring work after I/O
\`\`\`
`,
    interviewQuestions: [
      {
        question: "Explain the phases of the Node.js event loop.",
        answer: `The Node.js event loop has six phases:

1. **Timers**: Executes \`setTimeout()\` and \`setInterval()\` callbacks whose time has elapsed.
2. **Pending Callbacks**: Executes I/O callbacks deferred from the previous loop iteration.
3. **Idle/Prepare**: Used internally by Node.
4. **Poll**: Retrieves new I/O events. This is where Node.js spends most of its time. If there are no timers or callbacks, it blocks here.
5. **Check**: Executes \`setImmediate()\` callbacks.
6. **Close Callbacks**: Executes close event callbacks like \`socket.on('close')\`.

Between each phase, the microtask queue (process.nextTick and Promise callbacks) is fully drained.`
      },
      {
        question: "What is the difference between process.nextTick and setImmediate?",
        answer: `**\`process.nextTick\`** fires **before** the next event loop iteration begins (immediately after the current operation completes, no matter what phase we're in). **\`setImmediate\`** fires **during the check phase** of the next iteration.

The misleading naming: \`process.nextTick\` is actually "more immediate" than \`setImmediate\`. Use \`process.nextTick\` sparingly because it can starve the event loop (if you recursively call it, I/O never gets processed). Use \`setImmediate\` for deferring work that should happen after I/O.`
      },
      {
        question: "What are microtasks and how do they differ from macrotasks?",
        answer: `**Microtasks** (process.nextTick, Promise.then/catch/finally) are executed immediately after the current operation completes, before the next event loop iteration. **Macrotasks** (setTimeout, setInterval, setImmediate, I/O) are executed in their respective phases of the event loop.

Key difference: After each macrotask, the microtask queue is completely drained before the next macrotask runs. This means microtasks can starve macrotasks if they keep adding more microtasks.

Execution priority: nextTick > Promises > setTimeout/setInterval > setImmediate > I/O`
      }
    ],
    practicalTask: {
      scenario: "A colleague wrote code that blocks the event loop with a synchronous loop, making the server unresponsive. You need to demonstrate the problem and fix it using the event loop knowledge.",
      task: "Create: (1) a blocking example with a while loop that freezes the server, (2) a non-blocking version using setImmediate to break the work into chunks, (3) demonstrate the output order of setTimeout, Promise, nextTick, and setImmediate to prove understanding.",
      solutionCode: `// 1. Blocking example (DO NOT RUN IN PRODUCTION!)
function blockingOperation() {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    // Blocks the event loop for 5 seconds!
  }
  console.log("Done blocking");
}

// 2. Non-blocking version using setImmediate
function nonBlockingOperation(work, callback) {
  const chunk = work.splice(0, 10); // Process 10 items at a time
  console.log(\`Processing \${chunk.length} items...\`);

  if (work.length === 0) {
    callback("All done!");
  } else {
    setImmediate(() => nonBlockingOperation(work, callback));
  }
}

// 3. Event loop order demonstration
console.log("1. Start");

setTimeout(() => console.log("6. setTimeout"), 0);
setImmediate(() => console.log("5. setImmediate"));

Promise.resolve().then(() => console.log("3. Promise"));
process.nextTick(() => console.log("2. nextTick"));

console.log("4. End");

// Output: 1, 4, 2, 3, 5, 6
// (nextTick and Promise run before setTimeout/setImmediate)`
    }
  },
  // ==================== TOPIC 3 ====================
  {
    slug: "file-system-module",
    title: "3. File System (fs) Module",
    order: 3,
    content: `
# File System (fs) Module

## Reading Files

\`\`\`javascript
const fs = require("fs");

// Synchronous (blocking)
const data = fs.readFileSync("./file.txt", "utf8");
console.log(data);

// Asynchronous (non-blocking) with callback
fs.readFile("./file.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Promise-based (modern)
const fsPromises = require("fs").promises;

async function readFile() {
  try {
    const data = await fsPromises.readFile("./file.txt", "utf8");
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
\`\`\`

## Writing Files

\`\`\`javascript
// Overwrite
fs.writeFileSync("./output.txt", "Hello World");

// Append
fs.appendFileSync("./log.txt", "New log entry\\n");

// With promises
await fsPromises.writeFile("./output.txt", "Hello World", "utf8");
\`\`\`

## Directory Operations

\`\`\`javascript
// Create directory
fs.mkdirSync("./data", { recursive: true });

// List directory
const files = fs.readdirSync("./data");
console.log(files);

// Check if file exists
const exists = fs.existsSync("./file.txt");

// Get file stats
const stats = fs.statSync("./file.txt");
console.log(stats.isFile());     // true
console.log(stats.isDirectory());// false
console.log(stats.size);         // bytes
\`\`\`

## Watching Files

\`\`\`javascript
fs.watch("./file.txt", (eventType, filename) => {
  console.log(\`File \${filename}: \${eventType}\`);
});

// Watch directory recursively
fs.watch("./data", { recursive: true }, (event, file) => {
  console.log(\`\${file}: \${event}\`);
});
\`\`\`

## Working with Streams (for large files)

\`\`\`javascript
const readStream = fs.createReadStream("./large-file.txt", "utf8");
const writeStream = fs.createWriteStream("./output.txt");

// Pipe: read from one source and write to another
readStream.pipe(writeStream);

// Handle stream events
readStream.on("data", (chunk) => {
  console.log(\`Received \${chunk.length} bytes\`);
});

readStream.on("end", () => {
  console.log("Finished reading file");
});
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What are the different ways to read files in Node.js? Compare them.",
        answer: `Three approaches:

1. **Synchronous** (\`readFileSync\`): Blocks the event loop until the file is read. Simple but bad for production — freezes the server during read.
2. **Callback-based** (\`readFile\`): Non-blocking, uses a callback when done. Classic Node pattern but leads to callback hell.
3. **Promise-based** (\`fs.promises.readFile\`): Non-blocking, uses async/await. Modern, clean, and recommended for new code.

For large files, use **streams** (\`createReadStream\`) instead of reading the entire file into memory. Streams process data in chunks, which is memory-efficient for GB-sized files.`
      },
      {
        question: "What is the difference between readFile and createReadStream?",
        answer: `\`readFile\` reads the **entire file into memory** before calling the callback. For a 5GB file, it would allocate 5GB of RAM.

\`createReadStream\` reads the file in **small chunks** (default 64KB). Data is processed as it arrives, so memory usage stays low regardless of file size.

Use \`readFile\` for small files (< 50MB) where you need the complete content. Use \`createReadStream\` for large files or when you need to process data incrementally. Streams are essential when serving large files via HTTP (video streaming) or processing CSV/JSON line by line.`
      },
      {
        question: "What is the purpose of fs.watch and how would you use it?",
        answer: `\`fs.watch\` monitors a file or directory for changes. It emits events when files are modified, renamed, or deleted.

Use cases:
1. **Live reload** in development tools (like nodemon).
2. **File sync** — watching for new uploads.
3. **Log monitoring** — processing new log entries as they're written.

\`\`\`javascript
fs.watch("./logs", { recursive: true }, (event, file) => {
  console.log(\`\${event}: \${file}\`);
  // event: 'change' | 'rename'
});
\`\`\`

Note: \`fs.watch\` is platform-dependent and may not be 100% reliable. For production, consider using libraries like \`chokidar\` which provide a more consistent API.`
      }
    ],
    practicalTask: {
      scenario: "You need to build a simple file-based logging system that: (1) creates a logs directory if it doesn't exist, (2) appends timestamped log entries to a file, (3) reads the last 10 lines of the log file for display, (4) handles errors gracefully.",
      task: "Create a Logger class with methods: init() to create directory, log(level, message) to append a formatted log entry, readLast(n) to read the last n lines. Use the promise-based fs API and handle errors.",
      solutionCode: `const fs = require("fs").promises;
const path = require("path");

class Logger {
  constructor(dir = "./logs", file = "app.log") {
    this.logPath = path.join(dir, file);
    this.dir = dir;
  }

  async init() {
    try {
      await fs.mkdir(this.dir, { recursive: true });
      console.log(\`Logger initialized at \${this.logPath}\`);
    } catch (err) {
      console.error("Failed to create logs directory:", err.message);
    }
  }

  async log(level, message) {
    const timestamp = new Date().toISOString();
    const entry = \`[\${timestamp}] [\${level.toUpperCase()}] \${message}\\n\`;
    try {
      await fs.appendFile(this.logPath, entry, "utf8");
    } catch (err) {
      console.error("Failed to write log:", err.message);
    }
  }

  async readLast(n = 10) {
    try {
      const data = await fs.readFile(this.logPath, "utf8");
      const lines = data.trim().split("\\n");
      return lines.slice(-n);
    } catch (err) {
      if (err.code === "ENOENT") {
        return ["No log entries yet."];
      }
      throw err;
    }
  }
}

// Usage
async function main() {
  const logger = new Logger();
  await logger.init();

  await logger.log("info", "Application started");
  await logger.log("warn", "Memory usage high");
  await logger.log("error", "Database connection failed");

  const recent = await logger.readLast(5);
  console.log("Recent logs:");
  recent.forEach(line => console.log(line));
}

main().catch(console.error);`
    }
  },
  // ==================== TOPIC 4 ====================
  {
    slug: "streams-and-buffers",
    title: "4. Streams & Buffers",
    order: 4,
    content: `
# Streams & Buffers

## What are Streams?

Streams are **objects that let you read data from a source or write data to a destination continuously**. Instead of reading the entire resource into memory, streams process data in chunks.

### Types of Streams

| Type | Purpose | Example |
|------|---------|---------|
| Readable | Read data from source | \`fs.createReadStream\` |
| Writable | Write data to destination | \`fs.createWriteStream\` |
| Duplex | Both readable and writable | \`net.Socket\` |
| Transform | Modify data while reading/writing | \`zlib.createGzip\` |

## Buffers

A **Buffer** is a temporary memory storage area for binary data. It's used when dealing with streams, file I/O, and network operations.

\`\`\`javascript
// Create a buffer
const buf = Buffer.from("Hello World", "utf8");
console.log(buf);        // <Buffer 48 65 6c 6c 6f ...>
console.log(buf.length); // 11 bytes
console.log(buf.toString()); // "Hello World"

// Buffer manipulation
const buf2 = Buffer.alloc(1024);           // Empty buffer of 1KB
const buf3 = Buffer.allocUnsafe(1024);     // Faster but may contain old data
const buf4 = Buffer.concat([buf, buf2]);   // Concatenate buffers
\`\`\`

## Reading Files with Streams

\`\`\`javascript
const fs = require("fs");
const zlib = require("zlib");

// Read a large file efficiently
const readStream = fs.createReadStream("./large-file.txt", {
  highWaterMark: 64 * 1024, // 64KB chunks
  encoding: "utf8"
});

readStream.on("data", (chunk) => {
  console.log(\`Received \${chunk.length} bytes\`);
});

readStream.on("end", () => console.log("Finished"));
readStream.on("error", (err) => console.error(err));
\`\`\`

## Piping Streams

\`\`\`javascript
// Copy a file using pipe
const source = fs.createReadStream("./source.txt");
const dest = fs.createWriteStream("./dest.txt");
source.pipe(dest);

// Chain multiple streams
// Compress a file
fs.createReadStream("./input.txt")
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream("./input.txt.gz"));

// HTTP server streaming a file
const http = require("http");
const server = http.createServer((req, res) => {
  const stream = fs.createReadStream("./video.mp4");
  stream.pipe(res);
});
\`\`\`

## Transform Streams

\`\`\`javascript
const { Transform } = require("stream");

// Create a transform that converts to uppercase
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

// Use it in a pipeline
fs.createReadStream("./input.txt")
  .pipe(upperCaseTransform)
  .pipe(fs.createWriteStream("./output.txt"));
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What are streams in Node.js and why are they important?",
        answer: `Streams are **objects that allow processing data in chunks** rather than loading everything into memory. They're important because:

1. **Memory efficiency**: Process GB-sized files without using GB of RAM.
2. **Time efficiency**: Start processing data as soon as the first chunk arrives, rather than waiting for the complete data.
3. **Composability**: Streams can be piped together (like Unix pipes), creating powerful data processing pipelines.

Example: A video streaming server using \`createReadStream\` can serve a 4GB video file using only 64KB of RAM at a time, while \`readFile\` would crash with an out-of-memory error.`
      },
      {
        question: "What is the difference between readable, writable, duplex, and transform streams?",
        answer: `1. **Readable**: Source of data you can read from (\`fs.createReadStream\`, \`http.IncomingMessage\`).
2. **Writable**: Destination you can write to (\`fs.createWriteStream\`, \`http.ServerResponse\`).
3. **Duplex**: Both readable and writable, but they operate independently (\`net.Socket\`, \`webSocket\`).
4. **Transform**: A special duplex where the output is computed from the input (\`zlib.createGzip\`, \`crypto.createCipher\`).

Think of it as: Readable = faucet, Writable = sink, Duplex = pipe that goes both ways, Transform = filter/processor attached to the pipe.`
      },
      {
        question: "What is a Buffer and when would you use it?",
        answer: `A **Buffer** is a temporary storage for binary data that Node.js uses when dealing with raw memory allocation. Buffers are used whenever you work with:

1. **File I/O**: Reading/writing binary files (images, videos, zip files).
2. **Network streams**: TCP sockets, HTTP response bodies.
3. **Binary protocols**: Database drivers, message queues.
4. **Encoding/decoding**: Base64, hex, UTF-8 conversions.

\`\`\`javascript
// Buffers are essential because JavaScript didn't have a binary type
const buf = Buffer.from("Hello", "utf8");
console.log(buf.toString("base64")); // SGVsbG8=
console.log(buf.toString("hex"));    // 48656c6c6f
\`\`\`

Buffers exist outside the V8 heap, managed by Node.js itself, making them efficient for handling binary data.`
      }
    ],
    practicalTask: {
      scenario: "You're building a file compression service that: (1) reads a large text file, (2) compresses it using gzip, (3) streams it to a new file, (4) also shows progress as percentage of file processed. The solution must be memory-efficient (no loading entire file into memory).",
      task: "Create a function compressWithProgress(inputPath, outputPath) that: uses streams and pipeline, calculates and logs progress percentage based on bytes read vs total file size, handles errors gracefully with pipeline(). Use fs, zlib, and stream modules.",
      solutionCode: `const fs = require("fs");
const zlib = require("zlib");
const { pipeline, Transform } = require("stream");

async function compressWithProgress(inputPath, outputPath) {
  try {
    // Get total file size for progress calculation
    const stats = await fs.promises.stat(inputPath);
    const totalSize = stats.size;
    let bytesRead = 0;

    // Create a transform stream for progress tracking
    const progressTransform = new Transform({
      transform(chunk, encoding, callback) {
        bytesRead += chunk.length;
        const percent = ((bytesRead / totalSize) * 100).toFixed(1);
        console.log(\`Progress: \${percent}%\`);
        this.push(chunk);
        callback();
      }
    });

    console.log("Starting compression...");

    // Use pipeline for proper error handling
    await new Promise((resolve, reject) => {
      pipeline(
        fs.createReadStream(inputPath),
        progressTransform,
        zlib.createGzip(),
        fs.createWriteStream(outputPath),
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    const outputStats = await fs.promises.stat(outputPath);
    const ratio = ((1 - outputStats.size / totalSize) * 100).toFixed(1);
    console.log(\`Compression complete! Reduced by \${ratio}%\`);
    console.log(\`Output: \${outputPath} (\${outputStats.size} bytes)\`);
  } catch (err) {
    console.error("Compression failed:", err.message);
  }
}

// Usage
compressWithProgress("./large-dataset.csv", "./large-dataset.csv.gz");`
    }
  },
  // ==================== TOPIC 5 ====================
  {
    slug: "npm-and-packages",
    title: "5. npm & Package Management",
    order: 5,
    content: `
# npm & Package Management

## What is npm?

npm (Node Package Manager) is the default package manager for Node.js. It consists of:
- **CLI tool** (\`npm\`) for installing and managing packages
- **Registry** (registry.npmjs.org) hosting millions of packages
- **package.json** — the manifest file for your project

## package.json Deep Dive

\`\`\`json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "My awesome app",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.0.0"
  }
}
\`\`\`

## Dependency Types

| Type | Purpose | \`npm install\` flag |
|------|---------|---------------------|
| dependencies | Required at runtime | \`--save\` (default) |
| devDependencies | Only for development | \`--save-dev\` |
| peerDependencies | Host package expects | \`--save-peer\` |
| optionalDependencies | Installation failure is OK | \`--save-optional\` |

## Semantic Versioning

\`\`\`
^1.2.3 — Compatible with 1.x.x (major version fixed)
~1.2.3 — Compatible with 1.2.x (minor version fixed)
1.2.3  — Exact version
*      — Any version (risky!)
>=1.2.3 — Greater than or equal to
\`\`\`

## npm Scripts

\`\`\`bash
# Run a script
npm start         # runs "node index.js"
npm test          # runs "jest"
npm run dev       # runs "nodemon index.js"
npm run custom    # runs any custom script

# Pre/post hooks
npm run build     # automatically runs "prebuild" then "build" then "postbuild"
\`\`\`

## package-lock.json

The \`package-lock.json\` file **locks the exact version** of every dependency and its sub-dependencies. Always commit this file to version control!

## npx — Package Runner

\`\`\`bash
# Run a package without installing it globally
npx create-react-app my-app
npx prisma init
npx http-server
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What is the difference between dependencies and devDependencies?",
        answer: `**dependencies** are packages required to **run** the application in production (e.g., express, mongoose, react). **devDependencies** are packages only needed during **development** (e.g., testing frameworks, build tools, linters).

When you deploy to production, you run \`npm ci --production\` which only installs dependencies, not devDependencies. This reduces deployment size and attack surface.

\`\`\`bash
npm install express          # -> dependencies
npm install --save-dev jest  # -> devDependencies
npm install --production     # only install dependencies
\`\`\``
      },
      {
        question: "What is the purpose of package-lock.json? Should you commit it?",
        answer: `\`package-lock.json\` **locks the exact version** of every package and its transitive dependencies. Without it, different developers (or CI servers) might install slightly different versions, leading to "works on my machine" bugs.

**YES, always commit it.** The lock file ensures:
1. Reproducible builds across environments.
2. Faster installs (npm can skip resolving versions).
3. Security auditing (knows exactly what's installed).

If you're using \`yarn\`, the equivalent is \`yarn.lock\`. Never manually edit the lock file.`
      },
      {
        question: "Explain semantic versioning (semver) in the context of npm.",
        answer: `Semantic versioning uses the format \`MAJOR.MINOR.PATCH\`:

- **MAJOR** (1.x.x): Incompatible API changes (breaking changes).
- **MINOR** (x.2.x): Add functionality in a backward-compatible manner.
- **PATCH** (x.x.3): Backward-compatible bug fixes.

npm uses prefixes in package.json:
- \`^1.2.3\`: Compatible with major version 1 (allows minor and patch updates).
- \`~1.2.3\`: Only patch updates within 1.2.x.
- \`1.2.3\`: Exact version only.

Following semver correctly is a contract with the community — it allows automatic updates without fear of breaking changes.`
      }
    ],
    practicalTask: {
      scenario: "You're taking over a project where the package.json is a mess — mixed dependency types, no scripts, no lock file. You need to clean it up and set up proper development and production workflows.",
      task: "Create a proper package.json for a Node.js REST API that: (1) uses express as a runtime dependency, (2) uses nodemon and jest as dev dependencies, (3) has scripts for start, dev (with nodemon), test, and lint, (4) specifies proper node version in engines, (5) is configured as an ES module.",
      solutionCode: `{
  "name": "rest-api",
  "version": "1.0.0",
  "description": "Production-ready REST API",
  "type": "module",
  "main": "src/index.js",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "prepare": "husky install",
    "prestart": "echo 'Starting server...'",
    "poststart": "echo 'Server started successfully'"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.5.0",
    "@jest/globals": "^29.5.0",
    "eslint": "^8.40.0",
    "husky": "^8.0.0",
    "supertest": "^6.3.0"
  },
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": ["src/**/*.js"]
  }
}`
    }
  },
  // ==================== TOPIC 6 ====================
  {
    slug: "error-handling",
    title: "6. Error Handling in Node.js",
    order: 6,
    content: `
# Error Handling in Node.js

## Types of Errors

\`\`\`javascript
// 1. Operational Errors — predictable runtime problems
// (file not found, invalid input, network timeout)
try {
  await fs.readFile("/nonexistent.txt");
} catch (err) {
  console.error("Operational error:", err.message);
}

// 2. Programmer Errors — bugs in the code
// (undefined variable, type error, syntax error)
// These should crash and be fixed during development
\`\`\`

## Try/Catch for Async Code

\`\`\`javascript
// With async/await
async function readConfig() {
  try {
    const data = await fs.readFile("./config.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      return { host: "localhost" }; // Default config
    }
    throw new Error(\`Failed to read config: \${err.message}\`);
  }
}

// With Promises
fs.readFile("./file.txt")
  .then(data => console.log(data))
  .catch(err => console.error("Error:", err.message));
\`\`\`

## The Error Class

\`\`\`javascript
// Custom error classes
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage
throw new AppError("User not found", 404);
\`\`\`

## Unhandled Rejections & Exceptions

\`\`\`javascript
// Catch unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  // Optionally exit and restart
  process.exit(1);
});

// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Clean up and exit
  process.exit(1);
});

// Handle warnings (e.g., deprecated APIs)
process.on("warning", (warning) => {
  console.warn(warning.name, warning.message);
});
\`\`\`

## Express Error Handling Middleware

\`\`\`javascript
// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Route using the wrapper
app.get("/users/:id", asyncHandler(async (req, res) => {
  const user = await findUser(req.params.id);
  if (!user) throw new AppError("User not found", 404);
  res.json(user);
}));

// Global error handler (must have 4 params)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What is the difference between operational errors and programmer errors?",
        answer: `**Operational errors** are predictable runtime problems that should be handled gracefully:
- File not found (ENOENT)
- Invalid user input
- Network timeout
- Database connection failure
- Rate limiting

**Programmer errors** are bugs in the code that should crash and be fixed:
- TypeError (undefined is not a function)
- ReferenceError (variable not defined)
- SyntaxError
- Not checking for null before accessing a property

Operational errors should be caught and handled (retry, fallback, user-friendly message). Programmer errors should fail fast so they're caught during development. Use \`process.on('uncaughtException')\` only as a last resort to log and clean up.`
      },
      {
        question: "How do you handle async errors in Express.js?",
        answer: `Express 4 does NOT automatically catch errors thrown in async route handlers. If an async function throws, the promise rejects, but Express doesn't catch it — the server crashes.

Solution: Wrap all async route handlers with a catch function:

\`\`\`javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Now errors are forwarded to Express error handler
app.get("/data", asyncHandler(async (req, res) => {
  const data = await fetchData(); // If this throws, next(err) is called
  res.json(data);
}));

// Global error handler catches everything
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});
\`\`\`

In Express 5, async errors are automatically caught — no wrapper needed.`
      },
      {
        question: "What is the purpose of 'Error.captureStackTrace'?",
        answer: `\`Error.captureStackTrace(targetObject, constructorOpt)\` creates a \`.stack\` property on \`targetObject\` that shows where the error occurred, excluding the constructor function from the stack trace.

\`\`\`javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // Exclude AppError constructor from stack trace
    // The stack will show where AppError was instantiated, not the AppError class itself
    Error.captureStackTrace(this, this.constructor);
  }
}
\`\`\`

Without it, the stack trace would include the custom error class's constructor, which is noise. With it, the stack starts at the actual source of the error.`
      }
    ],
    practicalTask: {
      scenario: "You're building an Express API that interacts with a database and external services. You need a robust error handling system that: (1) creates structured errors with status codes, (2) catches all async errors automatically, (3) handles different error types with appropriate responses, (4) includes stack traces only in development.",
      task: "Create: (1) a custom AppError class, (2) an asyncHandler wrapper, (3) a global error handler middleware, (4) specific error types for 404 Not Found and 400 Validation errors, (5) Express app demonstrating all error types.",
      solutionCode: `// error-handler.js
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(\`\${resource} not found\`, 404);
    this.name = "NotFoundError";
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400);
    this.name = "ValidationError";
  }
}

// Async wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  // Log error
  console.error(\`[\${new Date().toISOString()}] \${err.name}: \${err.message}\`);

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Response
  res.status(statusCode).json({
    status: "error",
    message: err.isOperational ? err.message : "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

// app.js
const express = require("express");
const app = express();

// Routes
app.get("/users/:id", asyncHandler(async (req, res) => {
  const user = await findUser(req.params.id);
  if (!user) throw new NotFoundError("User");
  res.json(user);
}));

app.post("/users", asyncHandler(async (req, res) => {
  if (!req.body.name) throw new ValidationError("Name is required");
  const user = await createUser(req.body);
  res.status(201).json(user);
}));

app.get("/error", asyncHandler(async () => {
  throw new Error("Unexpected system error");
}));

// Global error handler (must be last)
app.use(errorHandler);

// Async route handler
async function findUser(id) {
  // Simulate database
  const users = { "1": { id: 1, name: "Alice" } };
  return users[id] || null;
}

async function createUser(data) {
  return { id: Date.now(), ...data };
}

app.listen(3000, () => console.log("Server running"));

module.exports = { AppError, NotFoundError, ValidationError, asyncHandler, errorHandler };`
    }
  },
  // ==================== TOPIC 7 ====================
  {
    slug: "child-processes",
    title: "7. Child Processes & Worker Threads",
    order: 7,
    content: `
# Child Processes & Worker Threads

## Why Child Processes?

Node.js runs on a single thread. For CPU-intensive tasks (image processing, video encoding, complex calculations), the event loop gets blocked. Child processes solve this by spawning separate OS processes.

## Child Process Module

\`\`\`javascript
const { spawn, exec, fork } = require("child_process");

// exec — runs a command and buffers output (for small results)
exec("ls -la", (error, stdout, stderr) => {
  if (error) console.error(error);
  console.log(stdout);
});

// spawn — streams output (for large results, long-running processes)
const child = spawn("find", [".", "-type", "f", "-name", "*.js"]);
child.stdout.on("data", (data) => console.log(\`Output: \${data}\`));
child.stderr.on("data", (data) => console.error(\`Error: \${data}\`));
child.on("close", (code) => console.log(\`Exited with code \${code}\`));
\`\`\`

## exec vs spawn

| Feature | exec | spawn |
|---------|------|-------|
| Output | Buffered (in memory) | Streamed |
| Use case | Short commands, small output | Long-running, large output |
| Size limit | ~200KB default | No limit |
| Returns | Buffer | Stream |

## fork — For Node.js Modules

\`\`\`javascript
// parent.js
const { fork } = require("child_process");

const child = fork("./worker.js");

child.send({ task: "compute", data: [1, 2, 3, 4, 5] });

child.on("message", (result) => {
  console.log("Result:", result);
});

// worker.js
process.on("message", (msg) => {
  if (msg.task === "compute") {
    const sum = msg.data.reduce((a, b) => a + b, 0);
    process.send(sum);
  }
});
\`\`\`

## Worker Threads (For CPU-Intensive Tasks)

\`\`\`javascript
const { Worker } = require("worker_threads");

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./math-worker.js", { workerData });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(\`Worker stopped with exit code \${code}\`));
    });
  });
}

// math-worker.js
const { parentPort, workerData } = require("worker_threads");

// Heavy computation that won't block the main thread
let result = 0;
for (let i = 0; i < workerData.iterations; i++) {
  result += Math.sqrt(i);
}

parentPort.postMessage(result);
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What is the difference between exec and spawn in the child_process module?",
        answer: `**\`exec\`** runs a command in a shell and **buffers the output** entirely in memory. It passes the complete stdout/stderr to the callback when the process finishes. Use \`exec\` for short commands with small output (like \`ls\` or \`git status\`). Default max buffer is 200KB.

**\`spawn\`** runs a command (without a shell by default) and **streams the output** via events. Data is available as soon as it's produced. Use \`spawn\` for long-running processes, large data output, or when you need to pipe data to/from the process.

\`\`\`javascript
// exec: buffers output (simple, but memory-heavy)
exec("cat large-file.txt", (err, stdout) => { ... });

// spawn: streams output (more complex, but efficient)
spawn("cat", ["large-file.txt"]).stdout.on("data", chunk => { ... });
\`\`\``
      },
      {
        question: "What is the difference between child_process.fork and worker_threads?",
        answer: `**\`child_process.fork\`** spawns a **new Node.js process** with its own V8 instance, event loop, and memory. Communication is via IPC (message passing). Heavy — each fork uses ~30MB+ of memory.

**\`worker_threads\`** spawns a **new thread** within the same Node.js process. Workers share the same process, so memory overhead is lower. They can even share memory via \`SharedArrayBuffer\`.

When to use:
- **fork**: Running separate applications, isolation, handling untrusted code.
- **worker_threads**: CPU-intensive tasks within the same app (image processing, data transformation, cryptography).

Worker threads are more efficient for computation because they avoid the overhead of creating a new V8 instance.`
      },
      {
        question: "How do you communicate between the parent and child process?",
        answer: `For **child_process.fork**: Use \`.send()\` and \`on('message')\` on both sides. The messages are serialized via JSON.

\`\`\`javascript
// Parent
const child = fork("./child.js");
child.send({ cmd: "compute", payload: [1, 2, 3] });
child.on("message", (result) => console.log("Got:", result));

// Child
process.on("message", (msg) => {
  if (msg.cmd === "compute") {
    process.send(msg.payload.reduce((a, b) => a + b));
  }
});
\`\`\`

For **worker_threads**: Same pattern but using \`parentPort\` and \`workerData\`.
For **spawn/exec**: Communication is via stdin/stdout pipes (streams) or by writing to files.`
      }
    ],
    practicalTask: {
      scenario: "Your web server is handling image uploads, but resizing large images blocks the event loop and freezes the server for all users. You need to offload the CPU-intensive image processing to a worker thread.",
      task: "Create: (1) a worker thread that resizes an image (simulated with a heavy loop), (2) a main thread that communicates with the worker, (3) error handling for worker failures, (4) a simple HTTP server that processes image requests without blocking.",
      solutionCode: `// image-worker.js
const { parentPort, workerData } = require("worker_threads");

// Simulate image processing (CPU-intensive)
function processImage({ width, height, format }) {
  console.log(\`Processing \${width}x\${height} image...\`);
  
  // Simulate heavy computation (image resize algorithm)
  const start = Date.now();
  let result = 0;
  for (let i = 0; i < 50000000; i++) {
    result += Math.sqrt(i);
  }
  
  return {
    original: { width, height, format },
    processed: {
      width: Math.floor(width / 2),
      height: Math.floor(height / 2),
      format: format,
      processingTime: Date.now() - start
    }
  };
}

// Listen for messages from parent
parentPort.postMessage(processImage(workerData));

// server.js
const { Worker } = require("worker_threads");
const http = require("http");
const path = require("path");
const url = require("url");

// Function to run image processing in worker
function processImageAsync(imageData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      path.join(__dirname, "image-worker.js"),
      { workerData: imageData }
    );
    
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(\`Worker exited with code \${code}\`));
      }
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      worker.terminate();
      reject(new Error("Processing timed out"));
    }, 10000);
  });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === "/process-image") {
    const { width = 1920, height = 1080, format = "jpg" } = parsedUrl.query;
    
    console.log("Received image processing request. Starting worker...");
    
    try {
      const result = await processImageAsync({
        width: Number(width),
        height: Number(height),
        format
      });
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        status: "success",
        data: result,
        message: "Server remains responsive during processing!"
      }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        status: "error",
        message: err.message
      }));
    }
  } else if (pathname === "/health") {
    // This endpoint proves the server isn't blocked
    res.writeHead(200);
    res.end("Server is responsive!");
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Try: http://localhost:3000/health (quick response)");
  console.log("And: http://localhost:3000/process-image?width=1920&height=1080 (uses worker)");
});`
    }
  },
  // ==================== TOPIC 8 ====================
  {
    slug: "clustering-and-scaling",
    title: "8. Clustering & Process Management",
    order: 8,
    content: `
# Clustering & Process Management

## Why Cluster?

Node.js runs on a single thread. A 32-core server running a standard Node app only uses 1 core. The **cluster module** allows you to spawn multiple worker processes that share the same server port.

## Built-in Cluster Module

\`\`\`javascript
const cluster = require("cluster");
const http = require("http");
const os = require("os");

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(\`Master \${process.pid} is running\`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart dead workers
  cluster.on("exit", (worker, code, signal) => {
    console.log(\`Worker \${worker.process.pid} died\`);
    cluster.fork();
  });
} else {
  // Workers share the TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(\`Handled by worker \${process.pid}\\n`);
  }).listen(8000);

  console.log(\`Worker \${process.pid} started\`);
}
\`\`\`

## PM2 — Production Process Manager

\`\`\`bash
# Install PM2
npm install -g pm2

# Start app in cluster mode
pm2 start app.js -i max

# Common commands
pm2 list           # List all processes
pm2 logs           # View logs
pm2 monit          # Monitor dashboard
pm2 restart all    # Restart all
pm2 stop 0         # Stop process 0
pm2 delete app     # Delete app

# Save process list for auto-restart on reboot
pm2 save
pm2 startup
\`\`\`

PM2 Ecosystem File

\`\`\`javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "my-app",
    script: "index.js",
    instances: "max",        // Use all CPU cores
    exec_mode: "cluster",    // Cluster mode
    watch: false,
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    max_memory_restart: "500M", // Restart if memory > 500MB
    log_date_format: "YYYY-MM-DD HH:mm Z",
    error_file: "./logs/err.log",
    out_file: "./logs/out.log"
  }]
};
\`\`\`

## Load Balancing

Cluster master distributes connections among workers using a **round-robin** algorithm (on Linux). Workers are independent processes — if one crashes, others continue serving.

## Zero-Downtime Deployment

\`\`\`bash
# Graceful reload (no downtime)
pm2 reload app

# Rolling restart with delay
pm2 restart app --delay 1000
\`\`\`
`,
    interviewQuestions: [
      {
        question: "How does Node.js clustering work and why is it needed?",
        answer: `Node.js runs on a **single thread** per process. On a server with 16 CPU cores, a standard Node app only uses 1 core — wasting 94% of the server's capacity.

The **cluster module** creates multiple Node.js worker processes, each running on a separate core. The master process listens on a port and distributes incoming connections to workers using round-robin (on Linux) or the OS's own scheduling.

Benefits:
1. **Full CPU utilization** — use all available cores.
2. **Fault tolerance** — if a worker crashes, the master restarts it.
3. **Zero-downtime deployments** — restart workers one by one.
4. **PM2 simplifies this** — \`pm2 start app.js -i max\` handles everything.`
      },
      {
        question: "How do you handle state persistence across workers in a cluster?",
        answer: `Workers in a cluster are **separate processes** — they don't share memory. In-memory state (like session data or counters) will be different on each worker.

Solutions:
1. **External store**: Use Redis, Memcached, or a database for shared state.
2. **Sticky sessions**: Configure the load balancer to send the same client to the same worker (cookie-based routing).
3. **Message passing**: Workers can communicate with the master via IPC (\`process.send()\`), but this is not efficient for high-frequency data.

Rule of thumb: Design your app as **stateless** — store session data, caches, and counters in Redis or a database. This makes horizontal scaling (adding more servers) trivial.`
      },
      {
        question: "What is PM2 and what are its key features?",
        answer: `PM2 is a **production process manager** for Node.js applications. Key features:

1. **Cluster mode**: Automatically scales across all CPU cores (\`-i max\`).
2. **Auto-restart**: Restarts the app if it crashes.
3. **Zero-downtime reload**: \`pm2 reload\` restarts workers one by one.
4. **Monitoring**: Built-in CLI monitor (\`pm2 monit\`) with CPU/memory usage.
5. **Log management**: Automatic log rotation and aggregation.
6. **Startup script**: \`pm2 startup\` ensures apps restart on server reboot.
7. **Ecosystem file**: YAML/JS config file for deployment configuration.
8. **Graceful shutdown**: Handle SIGINT to close connections before exit.`
      }
    ],
    practicalTask: {
      scenario: "You're deploying a Node.js API server to a production server with 4 CPU cores. You need to: (1) utilize all cores with clustering, (2) handle worker crashes gracefully, (3) implement graceful shutdown (close DB connections, finish requests), (4) set up PM2 configuration for production.",
      task: "Create: (1) a clustered server using the cluster module with master/worker pattern, (2) graceful shutdown handlers (SIGTERM, SIGINT), (3) worker health check endpoint, (4) PM2 ecosystem.config.js file.",
      solutionCode: `// server.js
const http = require("http");

// Health check endpoint (works in both single and cluster mode)
const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "healthy",
      pid: process.pid,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }));
    return;
  }

  // Simulate handling a request
  console.log(\`[\${process.pid}] Handling \${req.url}\`);
  res.writeHead(200);
  res.end(\`Response from worker \${process.pid}\\n\`);
});

// Graceful shutdown
function gracefulShutdown(signal) {
  console.log(\`[\${process.pid}] Received \${signal}. Shutting down gracefully...\`);
  server.close(() => {
    console.log(\`[\${process.pid}] All connections closed. Exiting.\`);
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error(\`[\${process.pid}] Forced shutdown\`);
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

server.listen(3000, () => {
  console.log(\`[\${process.pid}] Server listening on port 3000\`);
});

// cluster.js
const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(\`Master \${process.pid} is running\`);
  console.log(\`Starting \${numCPUs} workers...\`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();

    // Handle worker messages
    worker.on("message", (msg) => {
      if (msg.type === "health") {
        console.log(\`Worker \${worker.process.pid} is healthy\`);
      }
    });
  }

  // Restart dead workers
  cluster.on("exit", (worker, code, signal) => {
    console.log(\`Worker \${worker.process.pid} died (code: \${code})\`);
    console.log("Starting a new worker...");
    cluster.fork();
  });

  // Graceful shutdown for master
  process.on("SIGTERM", () => {
    console.log("Master shutting down...");
    for (const id in cluster.workers) {
      cluster.workers[id].kill("SIGTERM");
    }
    process.exit(0);
  });
} else {
  // Worker starts the server
  require("./server.js");
}

// ecosystem.config.js
module.exports = {
  apps: [{
    name: "api-server",
    script: "./cluster.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    max_memory_restart: "500M",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    merge_logs: true,
    kill_timeout: 10000
  }]
};`
    }
  },
  // ==================== TOPIC 9 ====================
  {
    slug: "environment-variables-and-config",
    title: "9. Environment Variables & Configuration",
    order: 9,
    content: `
# Environment Variables & Configuration

## Why Environment Variables?

Environment variables separate **configuration from code**. The same codebase can run in development, staging, and production without changes — just different environment files.

## Using process.env

\`\`\`javascript
// All environment variables are available via process.env
console.log(process.env.NODE_ENV);
console.log(process.env.PORT);
console.log(process.env.DB_URL);

// Set defaults with nullish coalescing
const port = process.env.PORT ?? 3000;
const nodeEnv = process.env.NODE_ENV ?? "development";

// Validate required variables
const required = ["DB_URL", "API_KEY", "JWT_SECRET"];
for (const varName of required) {
  if (!process.env[varName]) {
    throw new Error(\`Missing required env var: \${varName}\`);
  }
}
\`\`\`

## Using dotenv

\`\`\`bash
npm install dotenv
\`\`\`

\`\`\`javascript
// .env file (NEVER commit this to git!)
NODE_ENV=development
PORT=3000
DB_URL=mongodb://localhost:27017/myapp
API_KEY=sk_test_12345
LOG_LEVEL=debug

// Load .env in your app
require("dotenv").config();
// or with custom path
require("dotenv").config({ path: "./src/.env" });
\`\`\`

## .env vs .env.example

\`\`\`
# .env.example (COMMIT THIS - no secrets)
NODE_ENV=development
PORT=3000
DB_URL=mongodb://localhost:27017/myapp
API_KEY=your-api-key-here
LOG_LEVEL=debug

# .env (DON'T COMMIT - has real secrets)
NODE_ENV=production
PORT=443
DB_URL=mongodb+srv://user:pass@cluster.mongodb.net/prod
API_KEY=sk_live_abc123def456
LOG_LEVEL=error
\`\`\`

## Config Module Pattern

\`\`\`javascript
// config/index.js
require("dotenv").config();

const config = {
  env: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "3000", 10),
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",

  db: {
    url: process.env.DB_URL,
    poolSize: parseInt(process.env.DB_POOL_SIZE ?? "10", 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  },

  redis: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
  }
};

// Validate required config
function validateConfig() {
  const required = ["DB_URL", "JWT_SECRET"];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(\`Missing required config: \${missing.join(", ")}\`);
  }
}

validateConfig();

module.exports = config;
\`\`\`
`,
    interviewQuestions: [
      {
        question: "Why should you never commit .env files to version control?",
        answer: `\`.env\` files contain **secrets and sensitive configuration** — database passwords, API keys, JWT secrets, encryption keys. If committed to a public repository, these secrets are exposed to everyone.

Best practices:
1. Never commit \`.env\` — add it to \`.gitignore\`.
2. Commit \`.env.example\` — a template with dummy values and documentation.
3. Use environment-specific files: \`.env.development\`, \`.env.production\`.
4. For production, set environment variables directly on the server/container.
5. Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) for sensitive values.`
      },
      {
        question: "What is the dotenv package and how does it work?",
        answer: `**dotenv** loads environment variables from a \`.env\` file into \`process.env\`. It reads the file, parses each line (\`KEY=VALUE\`), and sets them as environment variables.

\`\`\`javascript
// Before dotenv
console.log(process.env.PORT); // undefined

// After dotenv
require("dotenv").config();
console.log(process.env.PORT); // "3000"
\`\`\`

Node has built-in \`.env\` support since v20.6+ via the \`--env-file\` flag:
\`\`\`bash
node --env-file=.env index.js
\`\`\`

This is the recommended approach for Node 20+ — no npm package needed.`
      },
      {
        question: "How do you handle configuration for multiple environments (dev, staging, prod)?",
        answer: `Approaches:

1. **Single .env with NODE_ENV**: Load \`.env\` always, then conditionally load \`.env.\${NODE_ENV}\` for overrides.
2. **Separate files**: \`.env.development\`, \`.env.staging\`, \`.env.production\`, and load the right one.
3. **System env vars**: Set variables directly on the server/CI (Docker, Kubernetes, Heroku) — no files needed.
4. **Config module**: A JavaScript config file that reads env vars and provides fallbacks/validation.

\`\`\`javascript
// Load environment-specific file
const env = process.env.NODE_ENV || "development";
require("dotenv").config({ path: \`./.env.\${env}\` });

// Or with node --env-file
// node --env-file=.env.production index.js
\`\`\`

Best practice: store secrets in the environment (not files), commit only \`.env.example\`.`
      }
    ],
    practicalTask: {
      scenario: "You're deploying a Node.js app to both development and production. You need a robust configuration system that: (1) loads environment-specific .env files, (2) validates required variables on startup, (3) provides sensible defaults, (4) exports a typed config object.",
      task: "Create: (1) .env.development and .env.example files, (2) a config/index.js module that loads the right file based on NODE_ENV, (3) validation that crashes on startup if required vars are missing, (4) an app.js that uses the config module to start a server.",
      solutionCode: `// .env.example (commit this)
NODE_ENV=development
PORT=3000
DB_URL=mongodb://localhost:27017/myapp
DB_POOL_SIZE=10
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
LOG_LEVEL=debug
REDIS_HOST=localhost
REDIS_PORT=6379

// .env.development (don't commit, but shown for example)
NODE_ENV=development
PORT=3000
DB_URL=mongodb://localhost:27017/dev_db
DB_POOL_SIZE=5
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=7d
LOG_LEVEL=debug

// config/index.js
const path = require("path");

// Load environment-specific .env file
const env = process.env.NODE_ENV || "development";
const envFile = path.resolve(__dirname, \`../../.env.\${env}\`);

try {
  require("dotenv").config({ path: envFile });
  console.log(\`Loaded config from .env.\${env}\`);
} catch {
  console.warn(\`No .env.\${env} file found, using system env vars\`);
}

// Config object with defaults and type coercion
const config = {
  env,
  isDev: env === "development",
  isProd: env === "production",
  isTest: env === "test",

  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    host: process.env.HOST || "0.0.0.0",
  },

  db: {
    url: process.env.DB_URL,
    poolSize: parseInt(process.env.DB_POOL_SIZE || "10", 10),
    ssl: env === "production",
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },

  log: {
    level: process.env.LOG_LEVEL || (env === "production" ? "info" : "debug"),
  },
};

// Validate required configuration
const REQUIRED_ENV_VARS = ["DB_URL", "JWT_SECRET"];
const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error(\`FATAL: Missing required environment variables:\`);
  missing.forEach(key => console.error(\`  - \${key}\`));
  console.error(\`\nPlease set them in .env.\${env} or as system env vars.\`);
  process.exit(1);
}

// Freeze config to prevent accidental modification
module.exports = Object.freeze(config);

// app.js
const config = require("./config");
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    message: "Server is running",
    environment: config.env,
    nodeVersion: process.version
  }));
});

server.listen(config.server.port, config.server.host, () => {
  console.log(\`\${config.env} server running on port \${config.server.port}\`);
  console.log(\`Log level: \${config.log.level}\`);
});`
    }
  },
  // ==================== TOPIC 10 ====================
  {
    slug: "security-best-practices",
    title: "10. Security Best Practices",
    order: 10,
    content: `
# Security Best Practices

## 1. Helmet — HTTP Headers

\`\`\`javascript
const helmet = require("helmet");
app.use(helmet());

// Helmet sets these secure headers:
// Content-Security-Policy
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: 0
// Strict-Transport-Security
// Referrer-Policy
\`\`\`

## 2. Rate Limiting

\`\`\`javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                    // 100 requests per window
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);
\`\`\`

## 3. Input Validation & Sanitization

\`\`\`javascript
// Prevent NoSQL injection (MongoDB)
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());

// Prevent XSS
const xss = require("xss-clean");
app.use(xss());

// Validate request body (using Joi or Zod)
const Joi = require("joi");
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

app.post("/register", (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
});
\`\`\`

## 4. Prevent SQL Injection

\`\`\`javascript
// NEVER concatenate user input into SQL queries!
// ❌ Bad
const query = \`SELECT * FROM users WHERE id = '\${req.params.id}'\`;

// ✅ Good — use parameterized queries
const query = "SELECT * FROM users WHERE id = $1";
const values = [req.params.id];
\`\`\`

## 5. Secure Authentication

\`\`\`javascript
// Hash passwords with bcrypt
const bcrypt = require("bcrypt");
const hash = await bcrypt.hash(password, 12); // Salt rounds = 12

// Compare
const isValid = await bcrypt.compare(inputPassword, hash);

// JWT best practices
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
  algorithm: "HS256"
});

// Store token securely: httpOnly + secure cookies
res.cookie("jwt", token, {
  httpOnly: true,    // Not accessible via JavaScript
  secure: true,      // HTTPS only
  sameSite: "strict",// CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000
});
\`\`\`

## 6. Dependencies

\`\`\`bash
# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated

# Update packages safely
npm update

# Use Snyk or Dependabot for continuous monitoring
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What security headers does Helmet set and why are they important?",
        answer: `Helmet sets HTTP response headers that protect against common web vulnerabilities:

1. **Content-Security-Policy**: Prevents XSS by controlling allowed content sources.
2. **X-Content-Type-Options: nosniff**: Prevents MIME type sniffing.
3. **X-Frame-Options: DENY**: Prevents clickjacking (loading your site in an iframe).
4. **Strict-Transport-Security**: Enforces HTTPS connections.
5. **X-XSS-Protection**: Enables browser's XSS filter (though modern browsers deprecate this).
6. **Referrer-Policy**: Controls what referrer info is sent.
7. **Permissions-Policy**: Restricts browser features (camera, microphone, etc.).

These headers prevent many common attacks without requiring code changes on your end.`
      },
      {
        question: "How do you prevent NoSQL injection in Node.js/MongoDB applications?",
        answer: `NoSQL injection occurs when attackers pass MongoDB operators (\`$gt\`, \`$ne\`, \`$where\`) in request parameters, potentially bypassing authentication or accessing unauthorized data.

\`\`\`javascript
// Attack example: { "email": "admin@test.com", "password": { "$gt": "" } }
// Without sanitization, this would match any password

// Prevention:
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());

// This removes $ and . from req.body, req.query, and req.params
// So { "$gt": "" } becomes { "gt": "" }, which is harmless

// Also: validate input types
const email = String(req.body.email); // Force to string
\`\`\`

Always combine sanitization with input validation (use Zod or Joi to enforce expected shapes).`
      },
      {
        question: "What are best practices for storing tokens and secrets in Node.js?",
        answer: `1. **Never hardcode secrets**: Store in environment variables or a secrets manager.
2. **Use bcrypt for passwords**: Salt rounds of 12+ make brute-force impractical.
3. **JWT storage**: Use \`httpOnly\`, \`secure\`, \`sameSite: 'strict'\` cookies — NOT localStorage (XSS vulnerable).
4. **Short-lived tokens**: Access tokens expire in 15 minutes, refresh tokens in 7 days.
5. **Rotate secrets**: Regularly rotate JWT secrets, API keys, and database passwords.
6. **Rate limit auth endpoints**: Prevent brute-force attacks on login/register.
7. **.gitignore**: Never commit .env files or config files with real secrets.
8. **Audit dependencies**: Run \`npm audit\` regularly to catch known vulnerabilities.`
      }
    ],
    practicalTask: {
      scenario: "You're securing an Express API that was built without any security measures. Users report that: (1) the app reveals its tech stack via headers, (2) someone tried SQL injection via the search endpoint, (3) there's no rate limiting, (4) sensitive cookies are accessible via JavaScript, (5) dependencies have known vulnerabilities.",
      task: "Create a security middleware setup that: (1) uses helmet for headers, (2) adds rate limiting, (3) sanitizes inputs (NoSQL/XSS), (4) sets secure cookies on login, (5) adds a security audit script to package.json.",
      solutionCode: `// security.js — Security middleware setup
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

// Configure CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Strict rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 attempts per window
  message: { error: "Too many attempts. Try again in 15 minutes." },
  standardHeaders: true
});

// General rate limiter for API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Rate limit exceeded" },
  standardHeaders: true
});

// Apply all middleware
function applySecurity(app) {
  // 1. HTTP headers
  app.use(helmet());
  
  // 2. CORS
  app.use(cors(corsOptions));
  
  // 3. Rate limiting
  app.use("/api/auth", authLimiter);
  app.use("/api", apiLimiter);
  
  // 4. Input sanitization
  app.use(mongoSanitize());  // Remove $ and . operators
  app.use(xss());            // Clean user input from malicious HTML
  
  // 5. Prevent HTTP parameter pollution
  app.use(hpp({
    whitelist: ["sort", "page", "limit"] // Allow duplicates for these params
  }));
  
  // 6. Hide tech stack
  app.disable("x-powered-by");
}

module.exports = { applySecurity, authLimiter, apiLimiter };

// app.js — Usage
const express = require("express");
const { applySecurity } = require("./security");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

// Apply all security middleware
applySecurity(app);

app.use(express.json({ limit: "10kb" })); // Limit body size

// Secure login endpoint
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Find user in database
  const user = await db.users.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m", algorithm: "HS256" }
  );

  // Set secure cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000
  });

  res.json({ message: "Login successful" });
});

app.listen(3000);

// package.json scripts
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "outdated": "npm outdated",
    "security:check": "snyk test || echo 'Consider installing snyk: npm install -g snyk'"
  }
}`
    }
  }
];

appendTopics(
  "nodejs",
  "Node.js — From Zero to Production",
  "Comprehensive Node.js documentation covering the event loop, file system, streams, error handling, clustering, security, and more. Includes interview questions and practical exercises.",
  topics,
);