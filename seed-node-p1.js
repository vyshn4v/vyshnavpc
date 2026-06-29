import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "nodejs-introduction",
    title: "1. Introduction to Node.js & V8 Engine",
    order: 1,
    content: `
# Introduction to Node.js & V8 Engine

Node.js has revolutionized modern web development by bringing JavaScript from the browser to the server. But what exactly is Node.js? It is a JavaScript runtime built on Chrome's V8 JavaScript engine. This chapter provides an incredibly exhaustive look at what Node.js is, how the V8 engine powers it, and why it is so fast and widely adopted.

## What is Node.js?

Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that executes JavaScript code outside a web browser. Historically, JavaScript was used primarily for client-side scripting, where scripts written in JavaScript were embedded in a webpage's HTML and run client-side by a JavaScript engine in the user's web browser. Node.js lets developers use JavaScript to write command-line tools and for server-side scripting—running scripts server-side to produce dynamic web page content before the page is sent to the user's web browser. 

Consequently, Node.js represents a "JavaScript everywhere" paradigm, unifying web application development around a single programming language, rather than different languages for server-side and client-side scripts.

### Key Characteristics of Node.js:
1. **Asynchronous and Event-Driven:** All APIs of Node.js library are asynchronous, that is, non-blocking. It essentially means a Node.js based server never waits for an API to return data. The server moves to the next API after calling it and a notification mechanism of Events of Node.js helps the server to get a response from the previous API call.
2. **Very Fast:** Being built on Google Chrome's V8 JavaScript Engine, Node.js library is very fast in code execution.
3. **Single Threaded but Highly Scalable:** Node.js uses a single threaded model with event looping. Event mechanism helps the server to respond in a non-blocking way and makes the server highly scalable as opposed to traditional servers which create limited threads to handle requests.
4. **No Buffering:** Node.js applications never buffer any data. These applications simply output the data in chunks.

## The V8 JavaScript Engine

V8 is Google’s open-source high-performance JavaScript and WebAssembly engine, written in C++. It is used in Chrome and in Node.js, among others. It implements ECMAScript and WebAssembly, and runs on Windows, macOS, and Linux systems that use x64, ARM, or MIPS processors. 

V8 can run standalone, or can be embedded into any C++ application. In the case of Node.js, V8 is the engine that parses and executes the JavaScript code.

### How V8 Works
V8 compiles JavaScript directly to native machine code before executing it, instead of more traditional techniques such as interpreting bytecode or compiling the whole program to machine code and executing it from a filesystem. The compiled code is additionally optimized (and re-optimized) dynamically at runtime, based on heuristics of the code's execution profile. Optimization techniques used include inlining, elision of expensive runtime properties, and inline caching.

When V8 compiles JavaScript code, the parser generates an Abstract Syntax Tree (AST). Then, Ignition, V8's interpreter, generates bytecode from this syntax tree. TurboFan, V8’s optimizing compiler, eventually takes the bytecode and generates optimized machine code from it.

### Node.js Architecture: libuv, V8, and Bindings

Node.js isn't just V8. It has other crucial components:
- **libuv**: A C library that provides Node.js with its event loop and asynchronous, non-blocking I/O model. It uses the underlying OS capabilities (like epoll on Linux, kqueue on macOS, IOCP on Windows) to handle asynchronous I/O operations.
- **V8 Engine**: Parses and executes JS code.
- **C++ Bindings**: Connects the V8 engine to libuv and other C/C++ libraries so JS code can interact with OS-level features (like file system and networking).

## Writing Your First Node.js Application

Let's write a simple Node.js script.

\`\`\`javascript
// hello-world.js
console.log("Hello, Node.js!");

// A simple timer
setTimeout(() => {
  console.log("This runs after 1 second");
}, 1000);

console.log("This runs before the timer");
\`\`\`

When you run this with \`node hello-world.js\`, V8 parses the script. \`console.log\` statements are synchronous, while \`setTimeout\` is asynchronous. The timer is offloaded to the environment (libuv) and the execution continues.

### Example: A basic OS inspection script
Let's see how Node bindings give JS access to the OS.

\`\`\`javascript
const os = require('os');

console.log('Platform:', os.platform());
console.log('CPU Architecture:', os.arch());
console.log('Total Memory:', os.totalmem() / 1024 / 1024 / 1024, 'GB');
console.log('Free Memory:', os.freemem() / 1024 / 1024 / 1024, 'GB');
console.log('CPU Cores:', os.cpus().length);
\`\`\`

## When Should You Use Node.js?
Node.js is incredibly powerful for certain types of applications:
- **I/O Bound Applications**: Apps that do a lot of database reading, network requests, or file system access.
- **Data Streaming Applications**: Audio/Video streaming servers, real-time data feeds.
- **Data Intensive Real-time Applications (DIRT)**: Chat applications, real-time collaboration tools.
- **JSON APIs based Applications**: Web APIs feeding single-page applications (SPAs) or mobile apps.

## When Should You NOT Use Node.js?
Node.js is generally a poor choice for **CPU-intensive operations** (like heavy image processing, video encoding, or complex mathematical computations). Because Node is single-threaded, a heavy CPU-bound task will block the event loop, preventing all other incoming requests from being processed until the computation finishes.
    `,
    interviewQuestions: [
      {
        question: "What is Node.js and how does it differ from traditional server-side technologies like PHP or Java?",
        answer: "Node.js is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 engine. Unlike traditional technologies that use a multi-threaded, blocking I/O model (creating a new thread for each request), Node.js uses a single-threaded, event-driven, non-blocking I/O model. This makes it highly efficient for I/O-heavy workloads and real-time applications."
      },
      {
        question: "What is the V8 engine?",
        answer: "V8 is Google's open-source high-performance JavaScript and WebAssembly engine, written in C++. It parses and executes JavaScript by compiling it directly into native machine code rather than interpreting it or executing bytecode. It powers Google Chrome and Node.js."
      },
      {
        question: "What is libuv and what role does it play in Node.js?",
        answer: "libuv is a multi-platform C library that provides support for asynchronous I/O based on event loops. It abstracts the OS-level non-blocking I/O mechanisms (like epoll on Linux or IOCP on Windows) and provides the Node.js event loop and a thread pool to handle heavy operations like File System I/O and DNS lookups."
      },
      {
        question: "Why is Node.js single-threaded and how does it handle concurrency?",
        answer: "Node.js is single-threaded to avoid the complexities of thread management, such as context switching and deadlocks, which often plague multi-threaded servers. It handles concurrency by offloading I/O operations to the system kernel (via libuv) whenever possible. When an I/O operation completes, a callback is added to the event queue, which the single main thread executes in the event loop."
      },
      {
        question: "What types of applications are best suited for Node.js?",
        answer: "Node.js is ideal for I/O-bound applications, real-time chat applications, streaming servers, Single Page Application (SPA) backend APIs, and microservices architectures. It is generally not suited for CPU-heavy applications like video encoding."
      }
    ],
    practicalTask: {
      scenario: "You need a simple CLI tool to gather information about the server Node is running on to log it to a monitoring dashboard.",
      task: "Write a Node.js script that prints out the OS platform, architecture, hostname, and the server's uptime in days, hours, minutes, and seconds.",
      solutionCode: `const os = require('os');

const formatUptime = (seconds) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  return \`\${d}d \${h}h \${m}m \${s}s\`;
};

console.log("=== Server Info ===");
console.log(\`Platform: \${os.platform()}\`);
console.log(\`Architecture: \${os.arch()}\`);
console.log(\`Hostname: \${os.hostname()}\`);
console.log(\`Uptime: \${formatUptime(os.uptime())}\`);
console.log("===================");`
    }
  },
  {
    slug: "nodejs-event-loop",
    title: "2. The Node.js Event Loop & Asynchronous Programming",
    order: 2,
    content: `
# The Node.js Event Loop & Asynchronous Programming

The Event Loop is the beating heart of Node.js. Understanding the event loop is perhaps the most critical milestone for any Node.js developer, because it dictates how asynchronous code executes, how callbacks are queued, and how the single-threaded nature of Node.js can handle thousands of concurrent connections.

## Asynchronous Programming in Node.js

Synchronous (blocking) programming means code is executed line-by-line. If one line takes a long time, the subsequent lines must wait. Asynchronous (non-blocking) programming means you can initiate an operation, register a callback, and let the code continue executing. When the operation finishes, the callback is executed.

### Callbacks
A callback is a function passed as an argument to another function, to be executed when an asynchronous operation completes.

\`\`\`javascript
const fs = require('fs');

console.log('1. Start reading file');

fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('2. File read complete. Length:', data.length);
});

console.log('3. This runs before the file finishes reading');
\`\`\`

### Promises
Promises are objects representing the eventual completion or failure of an asynchronous operation. They prevent "callback hell" (deeply nested callbacks).

\`\`\`javascript
const fsPromises = require('fs').promises;

fsPromises.readFile('example.txt', 'utf8')
  .then(data => console.log('File length:', data.length))
  .catch(err => console.error(err));
\`\`\`

### Async/Await
Introduced in ES2017, async/await provides a way to write asynchronous code that looks and behaves like synchronous code.

\`\`\`javascript
async function readMyFile() {
  try {
    const data = await fsPromises.readFile('example.txt', 'utf8');
    console.log('File length:', data.length);
  } catch (err) {
    console.error('Failed:', err);
  }
}
readMyFile();
\`\`\`

## Deep Dive into the Event Loop

The Event Loop is a mechanism provided by libuv. It continuously checks if there are any events to be processed (like network I/O, timers, or file operations) and executes their corresponding callbacks.

Node.js starts the event loop, executes the input script, and then processes the event loop in phases. 

### The Phases of the Event Loop
The event loop executes in specific phases, in a cyclic manner:

1. **Timers Phase**: Executes callbacks scheduled by \`setTimeout()\` and \`setInterval()\`.
2. **Pending Callbacks Phase**: Executes I/O callbacks deferred to the next loop iteration (e.g., some TCP errors).
3. **Idle, Prepare Phase**: Used internally by Node.js.
4. **Poll Phase**: Retrieves new I/O events; executes I/O related callbacks (almost all with the exception of close callbacks, timers, and \`setImmediate()\`); Node will block here when appropriate.
5. **Check Phase**: Executes \`setImmediate()\` callbacks.
6. **Close Callbacks Phase**: Executes close callbacks (e.g., \`socket.on('close', ...)\`).

Between each run of the event loop (and between phases), Node.js checks for two special queues:
- **nextTickQueue**: Holds callbacks registered via \`process.nextTick()\`. This queue is processed *immediately* after the current operation finishes, before moving to the next phase of the event loop.
- **microtaskQueue**: Holds Promise callbacks (like \`.then()\` and \`.catch()\`). Processed immediately after \`nextTickQueue\`.

### Event Loop Examples

Let's look at the execution order of different asynchronous mechanisms.

\`\`\`javascript
const fs = require('fs');

console.log('1. Script start'); // Synchronous

setTimeout(() => {
  console.log('5. setTimeout 0ms'); // Timers Phase
}, 0);

setImmediate(() => {
  console.log('6. setImmediate'); // Check Phase
});

Promise.resolve().then(() => {
  console.log('4. Promise resolved'); // Microtask Queue
});

process.nextTick(() => {
  console.log('3. process.nextTick'); // nextTick Queue
});

console.log('2. Script end'); // Synchronous
\`\`\`

**Output Order:**
1. \`1. Script start\`
2. \`2. Script end\`
3. \`3. process.nextTick\` (Highest priority async queue)
4. \`4. Promise resolved\` (Microtask queue)
5. \`5. setTimeout 0ms\` (Timers phase)
6. \`6. setImmediate\` (Check phase)

Wait, what if \`setTimeout\` and \`setImmediate\` are called within an I/O cycle?

\`\`\`javascript
const fs = require('fs');

fs.readFile(__filename, () => {
  console.log('I/O Callback');
  
  setTimeout(() => {
    console.log('setTimeout within I/O');
  }, 0);
  
  setImmediate(() => {
    console.log('setImmediate within I/O');
  });
});
\`\`\`

In an I/O cycle (which is processed in the Poll phase), \`setImmediate\` is always executed BEFORE \`setTimeout(..., 0)\` because the event loop proceeds from the Poll phase directly to the Check phase.

### Avoiding Event Loop Blockage
If you execute a computationally expensive synchronous operation, the event loop stops. It cannot process incoming requests, timers, or I/O callbacks. This is called "blocking the event loop."

\`\`\`javascript
// DO NOT DO THIS ON A PRODUCTION WEB SERVER
app.get('/compute', (req, res) => {
  let sum = 0;
  for (let i = 0; i < 1e10; i++) { // Massive loop
    sum += i;
  }
  res.send(\`Sum is \${sum}\`);
});
\`\`\`
While the loop runs, the server is dead to all other users. For CPU-bound tasks, use **Worker Threads** or spawn child processes.
    `,
    interviewQuestions: [
      {
        question: "Explain the Node.js Event Loop.",
        answer: "The event loop is what allows Node.js to perform non-blocking I/O operations despite being single-threaded. It delegates operations to the OS kernel whenever possible. It runs in phases: Timers, Pending Callbacks, Idle/Prepare, Poll, Check, and Close Callbacks. Between phases, it processes the nextTick and microtask queues."
      },
      {
        question: "What is the difference between process.nextTick() and setImmediate()?",
        answer: "process.nextTick() fires immediately on the same phase of the event loop, taking priority over the microtask queue. setImmediate() is designed to execute a script once the current poll phase completes, specifically firing in the Check phase of the event loop."
      },
      {
        question: "How does Node.js handle multiple simultaneous requests if it's single-threaded?",
        answer: "The single thread only handles the fast, non-blocking routing and event loop logic. When a request requires slow I/O (like reading a file or querying a DB), Node.js delegates this task to libuv and the OS, moving on to the next request immediately. When the I/O task finishes, its callback is queued in the event loop and executed."
      },
      {
        question: "What are Promises and how do they relate to the event loop?",
        answer: "Promises represent the eventual completion of an asynchronous operation. Promise callbacks (.then, .catch) go into the microtask queue, which gets drained completely right after the currently executing script and after the process.nextTick queue, before the event loop moves to its next phase."
      },
      {
        question: "What happens if you have a massive infinite loop in your Node.js code?",
        answer: "It will block the event loop. The main thread will be stuck executing the loop forever. No callbacks can be executed, no new requests can be accepted, and all timeouts will fail to fire. The application will hang."
      }
    ],
    practicalTask: {
      scenario: "You need to fetch data from an API, read a local config file, and process them together. You want to use modern async/await syntax to avoid callback hell.",
      task: "Write a Node.js script using async/await that reads 'config.json' from the disk (simulated with a promise) and fetches data from a dummy API URL (simulated with a promise), then logs both.",
      solutionCode: `const mockReadFile = () => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ apiKey: '12345xyz', url: 'https://api.example.com' }), 500);
  });
};

const mockFetchData = (url) => {
  return new Promise(resolve => {
    setTimeout(() => resolve([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]), 1000);
  });
};

async function processData() {
  try {
    console.log('1. Reading config...');
    const config = await mockReadFile();
    console.log('2. Config loaded:', config.url);
    
    console.log('3. Fetching data...');
    const data = await mockFetchData(config.url);
    console.log('4. Data fetched successfully:', data);
  } catch (error) {
    console.error('Error processing data:', error);
  }
}

processData();`
    }
  },
  {
    slug: "nodejs-modules-commonjs-esmodules",
    title: "3. Modules & CommonJS vs ES Modules",
    order: 3,
    content: `
# Modules & CommonJS vs ES Modules

In any large-scale application, organizing code into reusable, logical, and maintainable chunks is essential. Node.js achieved this from the very beginning using the CommonJS module system. Recently, however, Node.js has fully embraced the ECMAScript Modules (ESM) standard used by browsers. Understanding both systems, their differences, and how to interoperate them is a core requirement for a modern Node.js developer.

## What is a Module?
A module is simply a JavaScript file that encapsulates related code. It exports specific functions, objects, or variables, keeping internal logic private. This prevents global namespace pollution and allows code to be easily reused across multiple files.

## CommonJS (CJS)
CommonJS is the legacy module system originally built into Node.js. It uses \`require()\` to load modules and \`module.exports\` to export them. CommonJS is **synchronous**, meaning it loads modules line-by-line, reading the file from disk or cache before continuing execution.

### Exporting in CommonJS

\`\`\`javascript
// mathUtils.js (CommonJS)
const PI = 3.14159;

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// Export an object containing the functions
module.exports = {
  PI,
  add,
  subtract
};

// Alternative: Exporting individually
// exports.add = add;
// exports.subtract = subtract;
\`\`\`

### Importing in CommonJS

\`\`\`javascript
// app.js (CommonJS)
const mathUtils = require('./mathUtils');
// or using destructuring
const { add, PI } = require('./mathUtils');

console.log(mathUtils.add(5, 10)); // 15
console.log(PI); // 3.14159
\`\`\`

## ECMAScript Modules (ESM)
ES Modules is the official, standardized module system for JavaScript. It uses \`import\` and \`export\` statements. ESM is designed to be statically analyzable, meaning the dependencies can be determined before the code runs, allowing for optimizations like "tree shaking" (removing unused code). ESM loading is **asynchronous** and supports top-level await.

To use ESM in Node.js, you must either:
1. Save the file with an \`.mjs\` extension.
2. Add \`"type": "module"\` to your \`package.json\`.

### Exporting in ESM

\`\`\`javascript
// mathUtils.mjs (ESM)
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// Default export
export default function multiply(a, b) {
  return a * b;
}
\`\`\`

### Importing in ESM

\`\`\`javascript
// app.mjs (ESM)
// Must include file extensions (.js or .mjs) in relative ESM imports!
import multiply, { add, PI } from './mathUtils.mjs';

console.log(add(5, 10)); // 15
console.log(multiply(5, 10)); // 50
\`\`\`

## Key Differences Between CJS and ESM

1. **Syntax:** CJS uses \`require\`/\`module.exports\`. ESM uses \`import\`/\`export\`.
2. **Loading Mechanism:** CJS loads modules synchronously and sequentially. ESM loads asynchronously and evaluates statically.
3. **Strict Mode:** ESM files always execute in strict mode (\`"use strict";\`) automatically.
4. **Globals:** In CJS, variables like \`__dirname\` and \`__filename\` are globally available. In ESM, they are not available by default and must be reconstructed using \`import.meta.url\`.

### Simulating __dirname in ESM

Since \`__dirname\` doesn't exist in ESM, if you need to resolve absolute file paths, you have to build it:

\`\`\`javascript
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configPath = join(__dirname, 'config.json');
console.log(configPath);
\`\`\`

## Interoperability: Mixing CJS and ESM
In the modern ecosystem, you will often find projects using ESM that need to import legacy CJS modules, or vice versa.

**ESM importing CJS:**
This works seamlessly. You can import CJS modules into an ESM file using the default import.
\`\`\`javascript
import express from 'express'; // 'express' is a CJS module
import path from 'path'; // Core module
\`\`\`

**CJS importing ESM:**
You **cannot** use \`require()\` to load an ES Module because \`require\` is synchronous and ESM is asynchronous. However, you can use the dynamic \`import()\` function inside a CJS file.
\`\`\`javascript
// CJS file
async function loadEsmModule() {
  const { default: multiply } = await import('./mathUtils.mjs');
  console.log(multiply(2, 3));
}
loadEsmModule();
\`\`\`

## Top-Level Await
One massive benefit of ESM in Node.js is support for **Top-Level Await**. In CJS, you must wrap async code in an immediately invoked async function (IIFE). In ESM, you can use \`await\` directly at the root of a module.

\`\`\`javascript
// CJS workaround
(async () => {
  const data = await fetch('https://api.example.com');
})();

// ESM - Direct top-level await
import fetch from 'node-fetch';
const response = await fetch('https://api.example.com');
const data = await response.json();
console.log("Data loaded instantly!");
\`\`\`
    `,
    interviewQuestions: [
      {
        question: "What is the difference between CommonJS and ES Modules in Node.js?",
        answer: "CommonJS uses synchronous `require()` and `module.exports`, whereas ESM uses asynchronous `import` and `export`. ESM allows static analysis for tree-shaking, runs in strict mode by default, supports top-level await, and lacks CJS global variables like `__dirname`."
      },
      {
        question: "How do you enable ES Modules in a Node.js project?",
        answer: "You can enable ESM by either setting `\"type\": \"module\"` in the `package.json` file, which makes all `.js` files act as ESM, or by using the `.mjs` file extension for specific files."
      },
      {
        question: "How do you get the equivalent of `__dirname` in an ES Module?",
        answer: "You use `fileURLToPath(import.meta.url)` to get the `__filename`, and then use the `dirname` function from the `path` module to extract the `__dirname`."
      },
      {
        question: "Can you `require()` an ES Module inside a CommonJS file? Why or why not?",
        answer: "No, you cannot. `require()` is synchronous, and ES Modules evaluate asynchronously. To load an ESM file from a CJS file, you must use the dynamic, asynchronous `import()` function."
      },
      {
        question: "What is Top-Level Await and which module system supports it?",
        answer: "Top-Level Await allows the use of the `await` keyword at the top level of a file, without wrapping it in an `async` function. It is only supported in ES Modules (ESM)."
      }
    ],
    practicalTask: {
      scenario: "You are setting up a utility library using modern ES Modules. You need to create a logger utility and import it.",
      task: "Write two ESM files. `logger.mjs` exports a default function `info()` and a named function `error()`. `app.mjs` imports them and logs messages.",
      solutionCode: `// --- logger.mjs ---
export default function info(msg) {
  console.log(\`[INFO] - \${new Date().toISOString()}: \${msg}\`);
}

export function error(msg) {
  console.error(\`[ERROR] - \${new Date().toISOString()}: \${msg}\`);
}

// --- app.mjs ---
import logInfo, { error as logError } from './logger.mjs';

logInfo('Application started successfully.');
logError('Failed to connect to the database.');`
    }
  },
  {
    slug: "nodejs-core-modules",
    title: "4. Node.js Core Modules (fs, path, os, events)",
    order: 4,
    content: `
# Node.js Core Modules

Node.js comes with a rich set of built-in libraries known as Core Modules. These modules provide low-level access to the operating system, file system, networking, and utility functions without needing to install third-party packages via npm. 

This chapter dives deep into four of the most heavily used core modules: \`fs\` (File System), \`path\` (File Paths), \`os\` (Operating System), and \`events\` (Event Emitters).

## 1. The \`path\` Module

Different operating systems use different characters for file paths (Windows uses \`\\\`, Unix uses \`/\`). The \`path\` module provides utilities for working with file and directory paths in a cross-platform way.

\`\`\`javascript
const path = require('path');

// 1. path.join() - Joins path segments, resolving OS-specific separators.
const folderPath = path.join('/users', 'local', 'bin'); 
console.log(folderPath); // Linux: /users/local/bin | Windows: \\users\\local\\bin

// 2. path.resolve() - Resolves a sequence of paths into an ABSOLUTE path.
const absPath = path.resolve('users', 'local'); 
console.log(absPath); // e.g., C:\\Projects\\MyApp\\users\\local

// 3. path.basename() - Gets the last portion of a path (the filename)
console.log(path.basename('/users/docs/file.txt')); // file.txt

// 4. path.extname() - Gets the extension of the path
console.log(path.extname('server.config.json')); // .json

// 5. path.parse() - Returns an object representing the path
console.log(path.parse('/users/docs/file.txt'));
/*
{
  root: '/',
  dir: '/users/docs',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
*/
\`\`\`

## 2. The \`fs\` (File System) Module

The \`fs\` module allows you to interact with the file system to read, write, update, and delete files. It provides three APIs for most operations: Synchronous (blocks the event loop), Callbacks (asynchronous), and Promises (asynchronous, recommended).

### Reading and Writing Files (Promises API)

The modern standard is to use \`require('fs').promises\` or \`require('fs/promises')\` along with async/await.

\`\`\`javascript
const fs = require('fs/promises');
const path = require('path');

async function handleFiles() {
  const filePath = path.join(__dirname, 'data.txt');

  try {
    // 1. Write to a file (Overwrites existing content)
    await fs.writeFile(filePath, 'Hello, Node.js File System!\\n');
    console.log('File created and written.');

    // 2. Append to a file
    await fs.appendFile(filePath, 'Appending a new line.\\n');
    console.log('Text appended.');

    // 3. Read a file
    // Note: If you don't specify 'utf8', it returns a raw Buffer object.
    const content = await fs.readFile(filePath, 'utf8');
    console.log('--- File Content ---');
    console.log(content);
    
    // 4. Check file stats
    const stats = await fs.stat(filePath);
    console.log('File Size:', stats.size, 'bytes');
    console.log('Is Directory?', stats.isDirectory());

    // 5. Delete the file
    // await fs.unlink(filePath);
    // console.log('File deleted.');

  } catch (error) {
    console.error('File System Error:', error);
  }
}

handleFiles();
\`\`\`

## 3. The \`os\` Module

The \`os\` module provides operating system-related utility methods and properties. It's incredibly useful for building CLI tools, monitoring scripts, or conditional logic based on the OS.

\`\`\`javascript
const os = require('os');

console.log('OS Type:', os.type()); // e.g., 'Linux', 'Darwin', 'Windows_NT'
console.log('Platform:', os.platform()); // e.g., 'linux', 'darwin', 'win32'
console.log('CPU Architecture:', os.arch()); // e.g., 'x64', 'arm64'
console.log('Total Memory:', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('Free Memory:', (os.freemem() / 1024 / 1024 / 1024).toFixed(2), 'GB');

// Get CPU core information
const cpus = os.cpus();
console.log('Number of Cores:', cpus.length);
console.log('Core 1 Model:', cpus[0].model);

// Get network interfaces (IP addresses)
console.log('Network Interfaces:', os.networkInterfaces());

// Home directory and Temp directory
console.log('Home Dir:', os.homedir());
console.log('Temp Dir:', os.tmpdir());
\`\`\`

## 4. The \`events\` Module

Much of the Node.js core API is built around an idiomatic asynchronous event-driven architecture in which certain kinds of objects (called "emitters") emit named events that cause \`Function\` objects ("listeners") to be called.

For instance: a \`net.Server\` object emits an event each time a peer connects to it; an \`fs.ReadStream\` emits an event when the file is opened. All objects that emit events are instances of the \`EventEmitter\` class.

### Creating an Event Emitter

\`\`\`javascript
const EventEmitter = require('events');

// Create a custom class that extends EventEmitter
class TicketManager extends EventEmitter {
  constructor(supply) {
    super();
    this.supply = supply;
  }

  buy(email, price) {
    if (this.supply > 0) {
      this.supply--;
      // Emit an event, passing data to listeners
      this.emit('buy', email, price, Date.now());
    } else {
      this.emit('error', new Error('There are no more tickets left to purchase'));
    }
  }
}

// Instantiate and use
const ticketManager = new TicketManager(3);

// Add a listener for the 'buy' event
ticketManager.on('buy', (email, price, timestamp) => {
  console.log(\`Success! Ticket purchased by \${email} for $\${price} at \${timestamp}\`);
});

// Add a listener for the 'error' event
ticketManager.on('error', (error) => {
  console.error('Purchase Failed:', error.message);
});

// Trigger events
ticketManager.buy('user1@example.com', 20);
ticketManager.buy('user2@example.com', 20);
ticketManager.buy('user3@example.com', 20);
ticketManager.buy('user4@example.com', 20); // Triggers error
\`\`\`

Using \`EventEmitter\` allows you to decouple logic. The \`TicketManager\` doesn't need to know *how* to send an email or update a database; it just broadcasts that a ticket was bought, and other listeners in the application react to it.
    `,
    interviewQuestions: [
      {
        question: "Why should you use path.join() instead of simply concatenating strings with '/'?",
        answer: "Different operating systems use different path separators (e.g., Windows uses backslash \\, Unix uses forward slash /). `path.join()` normalizes the path and uses the correct separator for the host OS, preventing bugs."
      },
      {
        question: "What is the difference between fs.readFile and fs.readFileSync?",
        answer: "fs.readFile is asynchronous and non-blocking, using a callback (or Promise) when the file read completes. fs.readFileSync is synchronous and blocks the Node.js event loop until the file is fully read, which is bad for application performance in a web server."
      },
      {
        question: "What happens if you read a file with fs.readFile without specifying the encoding (e.g., 'utf8')?",
        answer: "It returns a raw Buffer object containing the binary data of the file, rather than a readable string."
      },
      {
        question: "What is an EventEmitter in Node.js?",
        answer: "EventEmitter is a core class in Node.js that facilitates an event-driven architecture. It allows objects to publish (emit) named events and allows other parts of the code to subscribe (listen) to those events using `.on()`."
      },
      {
        question: "How can you get the total memory of the system running a Node.js process?",
        answer: "By requiring the core `os` module and calling `os.totalmem()`, which returns the memory in bytes."
      }
    ],
    practicalTask: {
      scenario: "You need a script that creates a log file in the system's temporary directory, logs the current OS platform, and then reads it back.",
      task: "Use the os, path, and fs/promises modules to create 'os-log.txt' in the OS temporary directory, write the OS platform to it, and read/print its contents.",
      solutionCode: `const os = require('os');
const path = require('path');
const fs = require('fs/promises');

async function logSystemInfo() {
  const tmpDir = os.tmpdir();
  const filePath = path.join(tmpDir, 'os-log.txt');
  
  const content = \`System Platform: \${os.platform()}\\nCPU Arch: \${os.arch()}\\n\`;
  
  try {
    await fs.writeFile(filePath, content);
    console.log(\`Log file written to: \${filePath}\`);
    
    const readContent = await fs.readFile(filePath, 'utf8');
    console.log('--- Log Content ---');
    console.log(readContent);
  } catch (err) {
    console.error('Error:', err);
  }
}

logSystemInfo();`
    }
  },
  {
    slug: "nodejs-buffers-streams",
    title: "5. Buffers and Streams in Node.js",
    order: 5,
    content: `
# Buffers and Streams in Node.js

When dealing with files, network communications, or any form of I/O, Node.js is incredibly efficient. A large part of this efficiency comes from its handling of raw binary data through **Buffers** and its capability to process data in chunks through **Streams**, rather than loading entire datasets into memory.

## What is a Buffer?
A Buffer is a chunk of memory allocated outside the V8 JavaScript engine. It represents a fixed-length sequence of bytes. Since JavaScript historically had no mechanism for reading or manipulating streams of binary data (like an image file or a TCP stream), the Buffer class was introduced in Node.js to handle binary data.

### Creating and Using Buffers

\`\`\`javascript
// 1. Allocate an empty buffer of 10 bytes
const buf1 = Buffer.alloc(10);
console.log(buf1); // <Buffer 00 00 00 00 00 00 00 00 00 00>

// 2. Create a buffer from a string
const buf2 = Buffer.from('Hello World', 'utf8');
console.log(buf2); // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>

// 3. Convert Buffer back to string
console.log(buf2.toString()); // Hello World

// 4. Modify Buffer data (Buffers are array-like)
buf2[0] = 104; // 'h' in ASCII
console.log(buf2.toString()); // hello World
\`\`\`

Buffers are used extensively behind the scenes by Node.js. For instance, if you use \`fs.readFile\` without an encoding, you get a Buffer.

## What is a Stream?

A Stream is an abstract interface for working with streaming data. Think of streaming video: instead of downloading the entire 2GB video file before you can start watching, the server sends the video in small chunks, and the browser plays it as it arrives. 

Node.js streams do the exact same thing for data processing. They allow you to process data piece by piece as it arrives, keeping memory consumption extremely low.

### Types of Streams
Node.js provides 4 basic types of streams:
1. **Readable**: Streams from which data can be read (e.g., \`fs.createReadStream\`, \`http.IncomingMessage\`).
2. **Writable**: Streams to which data can be written (e.g., \`fs.createWriteStream\`, \`http.ServerResponse\`).
3. **Duplex**: Streams that are both Readable and Writable (e.g., \`net.Socket\`).
4. **Transform**: Duplex streams that can modify or transform the data as it is written and read (e.g., \`zlib.createDeflate\`).

### Example: Reading a large file without Streams
If you try to read a 1GB file using \`fs.readFile\`, Node.js will attempt to load the entire 1GB into memory (RAM). If many users request this file simultaneously, your server will crash with an out-of-memory error.

\`\`\`javascript
// Bad practice for large files
const fs = require('fs');
fs.readFile('huge-video.mp4', (err, data) => {
    // data is a giant buffer
    // RAM usage skyrockets
});
\`\`\`

### Example: Reading a large file WITH Streams
Using streams, you read the file in small chunks (typically 64KB by default). RAM usage stays near zero.

\`\`\`javascript
const fs = require('fs');

const readStream = fs.createReadStream('huge-video.mp4');

readStream.on('data', (chunk) => {
    console.log(\`Received \${chunk.length} bytes of data.\`);
    // Process chunk here
});

readStream.on('end', () => {
    console.log('Finished reading file.');
});
\`\`\`

## Piping Streams
The most powerful feature of streams is **piping**. Piping is a mechanism where the output of a Readable stream is directly connected to the input of a Writable stream. It automatically manages the flow of data, preventing the Writable stream from being overwhelmed by a fast Readable stream (a concept known as "backpressure").

### Example: Copying a large file via Pipes
\`\`\`javascript
const fs = require('fs');

// Create readable stream from source
const srcStream = fs.createReadStream('huge-file.txt');
// Create writable stream to destination
const destStream = fs.createWriteStream('copy-huge-file.txt');

// Pipe the read stream into the write stream
srcStream.pipe(destStream);

destStream.on('finish', () => {
    console.log('File successfully copied using pipes!');
});
\`\`\`

### Example: Transforming and Piping (Zipping a file)
You can chain multiple pipes together, piping through Transform streams. Here we use the core \`zlib\` module to compress a file on the fly.

\`\`\`javascript
const fs = require('fs');
const zlib = require('zlib');

const gzipTransform = zlib.createGzip();
const readStream = fs.createReadStream('data.txt');
const writeStream = fs.createWriteStream('data.txt.gz');

// Read -> Compress -> Write
readStream.pipe(gzipTransform).pipe(writeStream);

writeStream.on('finish', () => {
    console.log('File compressed successfully.');
});
\`\`\`
Piping is the ultimate Node.js superpower. It allows you to build highly scalable, memory-efficient data processing pipelines with very few lines of code.
    `,
    interviewQuestions: [
      {
        question: "What is a Buffer in Node.js?",
        answer: "A Buffer is an object in Node.js used to represent a fixed-length sequence of binary data. It allocates memory outside the V8 engine and is crucial for handling raw binary streams like file I/O or network packets."
      },
      {
        question: "What are Streams in Node.js and why are they important?",
        answer: "Streams are collections of data that might not be available all at once and don't have to fit in memory. They are important because they allow you to process massive amounts of data in small chunks without consuming large amounts of RAM."
      },
      {
        question: "What are the four types of streams in Node.js?",
        answer: "Readable (can read data), Writable (can write data), Duplex (can read and write), and Transform (Duplex streams that modify data as it passes through)."
      },
      {
        question: "What does the `.pipe()` method do?",
        answer: "The `.pipe()` method connects a Readable stream to a Writable stream. It reads data from the source and writes it to the destination, automatically handling data flow (backpressure) so the destination isn't overwhelmed."
      },
      {
        question: "What is backpressure in the context of Node.js streams?",
        answer: "Backpressure occurs when the Writable stream is processing data slower than the Readable stream is sending it. `.pipe()` handles this automatically by pausing the Readable stream until the Writable stream catches up, preventing memory exhaustion."
      }
    ],
    practicalTask: {
      scenario: "You need to securely erase a file by overwriting it, but you want to duplicate its contents to another file first. You decide to simply copy a text file using streams.",
      task: "Write a Node.js script that creates a readable stream from 'input.txt' and pipes it to a writable stream 'output.txt'.",
      solutionCode: `const fs = require('fs');

// Let's create a dummy input.txt first for the script to work
fs.writeFileSync('input.txt', 'This is a stream test.\\n'.repeat(100));

const readable = fs.createReadStream('input.txt');
const writable = fs.createWriteStream('output.txt');

readable.pipe(writable);

writable.on('finish', () => {
  console.log('Data successfully piped from input.txt to output.txt');
});`
    }
  }
];

appendTopics('nodejs', 'Node.js Enterprise Backend', 'The definitive guide.', topics);
