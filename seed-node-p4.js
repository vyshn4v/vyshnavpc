import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "node-advanced-event-loop-p4",
    title: "16. Advanced Event Loop Mechanics & Phase Queuing",
    order: 16,
    content: `<h2>Deep Dive into the Event Loop Phases</h2>
<p>The Node.js event loop operates on a single thread but offloads heavy tasks to the system kernel whenever possible. It runs in several distinct phases: Timers, Pending Callbacks, Idle/Prepare, Poll, Check, and Close Callbacks. Each phase has a FIFO queue of callbacks to execute.</p>
<h3>Microtasks vs Macrotasks</h3>
<p>Microtasks are not technically part of the event loop. They are processed between each phase, or even within a phase when a boundary is crossed. The microtask queue comprises two sub-queues: the <code>process.nextTick()</code> queue and the Promise queue.</p>
<pre><code>process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('Promise'));
setTimeout(() => console.log('Timeout'), 0);
setImmediate(() => console.log('Immediate'));
// Output: nextTick, Promise, Timeout/Immediate
</code></pre>
<h3>Event Loop Starvation</h3>
<p>If you recursively call <code>process.nextTick()</code>, the event loop will never reach the next phase, causing "event loop starvation". This is why recursive async calls should typically use <code>setImmediate()</code>.</p>
<h3>libuv and the Thread Pool</h3>
<p>libuv provides the event loop implementation. It also maintains a thread pool (default size of 4) for tasks that cannot be done asynchronously at the OS level, such as certain <code>fs</code>, <code>crypto</code>, and <code>dns</code> operations.</p>`,
    interviewQuestions: [
      { question: "What is the exact execution order of setImmediate vs setTimeout(..., 0)?", answer: "Within an I/O cycle, setImmediate always executes first. In the main module context, the order depends on process performance." },
      { question: "How does process.nextTick() differ from Promises in the microtask queue?", answer: "process.nextTick() queue is evaluated before the Promise microtask queue. Thus, nextTick callbacks run before Promise.then()." },
      { question: "What happens during the 'poll' phase of the Event Loop?", answer: "It retrieves new I/O events, executing their callbacks. If empty, it waits for new I/O or proceeds to the check phase if setImmediate is queued." },
      { question: "How can you intentionally block the event loop, and why is it dangerous?", answer: "Synchronous CPU-bound tasks like JSON.parse on huge files or crypto.pbkdf2Sync block the loop, stopping the server from responding to new requests." },
      { question: "What is event loop starvation?", answer: "When process.nextTick() is called recursively, it prevents the event loop from moving to the next phase, freezing I/O and timers." },
      { question: "How does UV_THREADPOOL_SIZE affect performance?", answer: "It configures the number of threads used by libuv. Increasing it can improve performance for heavy fs/crypto operations but adds memory/context-switching overhead." }
    ],
    practicalTask: {
      scenario: "Diagnosing event loop latency.",
      task: "Write a script that monitors event loop lag using the perf_hooks module.",
      solutionCode: "import { monitorEventLoopDelay } from 'perf_hooks';\nconst h = monitorEventLoopDelay({ resolution: 20 });\nh.enable();\nsetTimeout(() => console.log(h.mean), 1000);"
    }
  },
  {
    slug: "node-worker-threads-p4",
    title: "17. Worker Threads and Multi-threading",
    order: 17,
    content: `<h2>Breaking the Single Thread Limit</h2>
<p>Node.js added the <code>worker_threads</code> module to allow execution of JavaScript in parallel. Unlike child processes or clustering, worker threads share memory by transferring <code>ArrayBuffer</code> instances or using <code>SharedArrayBuffer</code>.</p>
<h3>When to Use Worker Threads</h3>
<p>They are ideal for CPU-intensive JavaScript operations, such as complex mathematical calculations, image processing, or large data parsing. They are NOT recommended for I/O-intensive work, which is handled perfectly by the built-in async I/O.</p>
<pre><code>import { Worker, isMainThread, parentPort } from 'worker_threads';
if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', msg => console.log(msg));
} else {
  let count = 0;
  for(let i = 0; i &lt; 1e9; i++) count++;
  parentPort.postMessage(count);
}
</code></pre>
<h3>Message Ports and Channels</h3>
<p>Communication between threads is done via <code>MessageChannel</code>. You can pass complex objects through structured cloning. For extreme performance, passing an ArrayBuffer transfers ownership entirely to avoid cloning costs.</p>`,
    interviewQuestions: [
      { question: "What is the primary use case for Worker Threads in Node.js?", answer: "Executing CPU-bound operations without blocking the main event loop." },
      { question: "How do Worker Threads differ from the cluster module?", answer: "Cluster spawns entire new Node.js processes with their own memory and V8 instance. Worker threads run within the same process and can share memory." },
      { question: "What is SharedArrayBuffer and how is it used in Worker Threads?", answer: "It allows multiple threads to read and write to the same memory space simultaneously. It usually requires Atomics to prevent race conditions." },
      { question: "Does creating a Worker Thread block the main thread?", answer: "No, thread creation is asynchronous, but spawning too many workers can exhaust system memory and CPU resources." },
      { question: "How can you pass data between the main thread and a Worker?", answer: "Using the postMessage() API, which serializes data using the HTML structured clone algorithm, or by transferring ArrayBuffers." }
    ],
    practicalTask: {
      scenario: "You need to process a heavy CPU task.",
      task: "Create a worker thread that computes a fibonacci number.",
      solutionCode: "import { Worker } from 'worker_threads';\nnew Worker('./fib.js', { workerData: { num: 40 } }).on('message', console.log);"
    }
  },
  {
    slug: "node-streams-advanced-p4",
    title: "18. Streams API: Deep Dive into Transform and Duplex",
    order: 18,
    content: `<h2>Advanced Stream Architectures</h2>
<p>Streams are the most efficient way to handle massive data payloads. The core types are Readable, Writable, Duplex, and Transform. Streams buffer data in memory chunks to prevent excessive RAM consumption.</p>
<h3>Transform Streams</h3>
<p>Transform streams are Duplex streams where the output is computed in some way from the input. For instance, zlib and crypto streams are Transform streams.</p>
<pre><code>import { Transform } from 'stream';
const uppercase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});
process.stdin.pipe(uppercase).pipe(process.stdout);
</code></pre>
<h3>Pipeline and Pump</h3>
<p>Using <code>.pipe()</code> directly is an anti-pattern in production because it doesn't handle errors well. If the readable stream emits an error, the writable stream is not automatically closed, causing memory leaks. Always use <code>stream.pipeline</code> or the async iterator approach.</p>`,
    interviewQuestions: [
      { question: "What is the difference between a Duplex stream and a Transform stream?", answer: "A Duplex stream implements both Readable and Writable independently. A Transform stream is a Duplex stream where the output is directly derived from the input." },
      { question: "Why is stream.pipeline() preferred over .pipe()?", answer: "pipeline() properly handles error forwarding and cleanup across all streams in the chain, preventing memory leaks." },
      { question: "What is backpressure in Node.js streams?", answer: "It occurs when a Writable stream cannot process data as fast as a Readable stream is sending it. Node.js pauses the Readable stream until the Writable stream drains." },
      { question: "How do you handle backpressure manually?", answer: "By checking the return value of writable.write(chunk). If false, you wait for the 'drain' event before writing more data." },
      { question: "Can you use async generators with streams?", answer: "Yes, Node.js streams implement the async iterable protocol, so you can use 'for await (const chunk of stream)' to consume data." }
    ],
    practicalTask: {
      scenario: "Safely processing a file transformation.",
      task: "Use stream.pipeline to compress a file using zlib.",
      solutionCode: "import { pipeline } from 'stream/promises';\nimport fs from 'fs';\nimport zlib from 'zlib';\nawait pipeline(fs.createReadStream('in.txt'), zlib.createGzip(), fs.createWriteStream('out.gz'));"
    }
  },
  {
    slug: "node-buffers-binary-p4",
    title: "19. Buffers and Binary Data Processing at Scale",
    order: 19,
    content: `<h2>Handling Raw Memory in V8</h2>
<p>The <code>Buffer</code> class is a global object in Node.js designed to handle raw binary data outside the V8 heap. This is critical for reading files, interacting with streams, and network protocols.</p>
<h3>Buffer Allocation Strategies</h3>
<p><code>Buffer.alloc(size)</code> guarantees a clean, zero-filled buffer. <code>Buffer.allocUnsafe(size)</code> is much faster but may contain old, potentially sensitive data. It should only be used when you know you will overwrite the entire buffer immediately.</p>
<pre><code>const buf1 = Buffer.alloc(10); // Zero-filled
const buf2 = Buffer.allocUnsafe(10); // Might contain garbage
const buf3 = Buffer.from('Hello World'); // From string
console.log(buf3.toString('base64')); // Encoding to base64
</code></pre>
<h3>Working with TypedArrays</h3>
<p>Node.js Buffers are essentially <code>Uint8Array</code> instances with some extra utility methods. You can share the underlying <code>ArrayBuffer</code> with other TypedArrays like <code>Float32Array</code> for rapid math operations.</p>`,
    interviewQuestions: [
      { question: "What is the difference between Buffer.alloc() and Buffer.allocUnsafe()?", answer: "alloc() zeroes out memory for security. allocUnsafe() skips zeroing, making it faster but risking data leaks if not fully overwritten." },
      { question: "Where is Buffer memory allocated?", answer: "Outside the V8 JavaScript engine heap. It is allocated in C++ using malloc, which avoids garbage collection overhead for large data." },
      { question: "How do you convert a Buffer to a JSON object?", answer: "Calling .toJSON() on a buffer returns an object like { type: 'Buffer', data: [ ...bytes... ] }." },
      { question: "What happens if you exceed a Buffer's defined size?", answer: "It will not dynamically resize. Writing past the end of a buffer is silently truncated or throws an error depending on the method." },
      { question: "Are Buffers part of the standard ECMAScript specification?", answer: "No, Buffer is a Node.js API, though modern JS introduced Uint8Array which Buffer now extends." }
    ],
    practicalTask: {
      scenario: "You need to extract an integer from network packets.",
      task: "Create a Buffer and write a 32-bit integer, then read it back.",
      solutionCode: "const buf = Buffer.alloc(4);\nbuf.writeInt32BE(12345, 0);\nconsole.log(buf.readInt32BE(0));"
    }
  },
  {
    slug: "node-child-processes-p4",
    title: "20. Child Processes: fork, spawn, exec, and IPC",
    order: 20,
    content: `<h2>Scaling Beyond a Single Process</h2>
<p>The <code>child_process</code> module enables executing OS commands and other Node.js scripts. This provides a way to scale by forking new processes.</p>
<h3>spawn vs exec</h3>
<p><code>spawn</code> launches a command in a new process and streams the output via stdout/stderr. It is suitable for large payloads. <code>exec</code> runs a command in a shell and buffers the output in memory, returning it to a callback. It is only suitable for small outputs.</p>
<pre><code>import { spawn, exec, fork } from 'child_process';
// Spawn: streaming
const ls = spawn('ls', ['-lh', '/usr']);
ls.stdout.on('data', (data) => console.log(data.toString()));

// Exec: buffering
exec('cat file.txt', (err, stdout) => {
  if (err) throw err;
  console.log(stdout);
});
</code></pre>
<h3>fork and Inter-Process Communication (IPC)</h3>
<p><code>fork</code> is a special variation of <code>spawn</code> designed specifically to launch other Node.js scripts. It establishes an IPC communication channel, allowing you to use <code>process.send()</code> and <code>process.on('message')</code> to easily pass JSON messages between the parent and child.</p>`,
    interviewQuestions: [
      { question: "When should you use spawn over exec?", answer: "Use spawn when expecting a large amount of output, as it streams data. exec buffers data in memory and can crash with a MaxBuffer error." },
      { question: "What is the specific use case for fork()?", answer: "fork is used exclusively for spawning new Node.js processes. It automatically establishes an IPC channel for message passing." },
      { question: "How does the cluster module relate to child_process.fork?", answer: "The cluster module is built on top of child_process.fork, adding automatic load balancing and socket sharing across workers." },
      { question: "What happens to a child process if the parent process dies?", answer: "By default, the child process is terminated. However, if detached: true is passed in options, the child will continue running independently." },
      { question: "Can you pass a socket or server instance to a child process?", answer: "Yes, using child.send(message, sendHandle), you can pass a TCP server or socket to a forked child process." }
    ],
    practicalTask: {
      scenario: "Delegating a heavy task to a separate process.",
      task: "Fork a script and send it a message.",
      solutionCode: "import { fork } from 'child_process';\nconst child = fork('./worker.js');\nchild.send({ hello: 'world' });"
    }
  }
];

appendTopics('nodejs', 'Node.js Enterprise Backend', 'The definitive guide.', topics);
